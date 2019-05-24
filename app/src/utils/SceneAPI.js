import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../interactives/rules/Rule";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";
import Switch from "../interactives/Switch";
import Key from "../interactives/Key";
import Lock from "../interactives/Lock"
import Orders from "../data/Orders";
import Action from "../interactives/rules/Action";
import Immutable from 'immutable';
import stores_utils from "../data/stores_utils";
import SuperCondition from "../interactives/rules/SuperCondition";
import Condition from "../interactives/rules/Condition";
import Audio from "../audio/Audio";
let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

/**
 * Retrieves scene data from db and generates a new Scene object
 * @param name of the scene
 * @param order actual order of the scenes in editor
 */
function getByName(name, order = null) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            const adj = []; // neighbours list
            let transitions_uuids = [];
            let switches_uuids = [];
            let collectable_keys_uuids = [];
            let locks_uuids = [];
            let rules_uuids = [];
            let audio_uuids = [];

            let scene_type = response.body.type;


            // generates transitions and saves them to the objects store
            response.body.transitions.map((transition) => {
                transitions_uuids.push(transition.uuid); // save uuid
                let t = Transition({
                    uuid: transition.uuid,
                    name: transition.name,
                    type: transition.type,
                    media: JSON.parse(transition.media),
                    mask: transition.mask,
                    audio: JSON.parse(transition.audio),
                    vertices: transition.vertices,
                    properties: JSON.parse(transition.properties),
                });
                Actions.receiveObject(t, scene_type);
            });

            // generates switches and saves them to the objects store
            response.body.switches.map((sw) => {
                switches_uuids.push(sw.uuid); //save uuid
                let s = Switch({
                    uuid: sw.uuid,
                    name: sw.name,
                    type: sw.type,
                    media: JSON.parse(sw.media),
                    mask: sw.mask,
                    audio: JSON.parse(sw.audio),
                    vertices: sw.vertices,
                    properties: JSON.parse(sw.properties),
                });
                Actions.receiveObject(s, scene_type);
            });

            // generates key and saves them to the objects store
            response.body.collectable_keys.map((key) => {
                collectable_keys_uuids.push(key.uuid); //save uuid
                let k = Key({
                    uuid: key.uuid,
                    name: key.name,
                    type: key.type,
                    media: JSON.parse(key.media),
                    mask: key.mask,
                    audio: JSON.parse(key.audio),
                    vertices: key.vertices,
                    properties: JSON.parse(key.properties),
                });
                Actions.receiveObject(k, scene_type);
            });

            // generates lock and saves them to the objects store
            response.body.locks.map((lock) => {
                locks_uuids.push(lock.uuid); //save uuid
                let l = Lock({
                    uuid: lock.uuid,
                    name: lock.name,
                    type: lock.type,
                    media: JSON.parse(lock.media),
                    mask: lock.mask,
                    audio: JSON.parse(lock.audio),
                    vertices: lock.vertices,
                    properties: JSON.parse(lock.properties),
                });
                Actions.receiveObject(l, scene_type);
            });

            // generates rules and saves them to the rules store
            response.body.rules.map(rule => {
                // check actions to find scene neighbours and create new immutable action
                let actions = rule.actions.map(a => {
                    if (a.action === RuleActionTypes.TRANSITION && a.obj_uuid && a.obj_uuid !== null)
                        adj.push(a.obj_uuid);

                    return Action({
                        uuid: a.uuid,
                        subj_uuid: a.subj_uuid,
                        action: a.action,
                        obj_uuid: a.obj_uuid,
                        index: a.index,
                    });
                });

                actions = Immutable.List(actions).sort(stores_utils.actionComparator);

                rules_uuids.push(rule.uuid); // save uuid

                let event;

                try{
                    event = JSON.parse(rule.event)
                    // new Rule
                    let r = Rule({
                        uuid: rule.uuid,
                        event: Action({
                            uuid: event.uuid,
                            subj_uuid: event.subj_uuid,
                            action: event.action,
                            obj_uuid: event.obj_uuid,
                        }),
                        condition: conditionParser(JSON.parse(rule.condition)),
                        actions: actions,
                    });
                    Actions.receiveRule(r);
                }catch(e){}


            });

            response.body.audios.map(audio => {
               audio_uuids.push(audio.uuid);
               let a = Audio({
                   uuid: audio.uuid,
                   name: audio.name,
                   file: audio.file,
                   isSpatial: audio.isSpatial,
                   scene: audio.scene,
                   loop: audio.loop,
               });
               Actions.receiveAudio(a);
            });



            let tag = response.body.tag.uuid ? response.body.tag.uuid : "default";

            // new Scene object
            let newScene = Scene({
                uuid: response.body.uuid,
                name : response.body.name,
                img : response.body.img,
                type : response.body.type,
                index : response.body.index,
                tag : tag,
                objects : {
                    transitions : transitions_uuids,
                    switches : switches_uuids,
                    collectable_keys: collectable_keys_uuids,
                    locks: locks_uuids,
                },
                rules : rules_uuids,
                audios : audio_uuids,
            });

            Actions.receiveScene(newScene, order);

        });
}

/**
 * Creates new Scene inside db and stores
 * @param name
 * @param img
 * @param index
 * @param type
 * @param tag
 * @param order of scenes
 */
function createScene(name, img, index, type, tag, order) {
    let id = uuid.v4();
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({uuid: id, name: name, img: img, index: index, type: type, tag: tag})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            
            // new Scene object
            let newScene = Scene({
                uuid: id,
                name : name,
                img : img,
                type : type,
                index : index,
                tag : tag,
                rules: [],
                objects: {
                    transitions: [],
                    switches: [],
                    collectable_keys: [],
                    locks: [],
                }
            });

            Actions.receiveScene(newScene, order);
        });
}

/**
 * Update a scene inside db
 * @param uuid
 * @param name
 * @param type
 * @param tag
 */
function updateScene(uuid, name, img, type, tag) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/updateScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({uuid: uuid, name: name, img: img, type: type, tag: tag})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });
}

/**
 * Retrieves all data from db and sends it to stores for scenes generations
 */
function getAllScenesAndTags() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/tags`)
        .set('Accept', 'application/json')
        .end(function (err, responseT) {
            if (err) {
                return console.error(err);
            }
            if (responseT.body && responseT.body !== [])
                request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes`)
                    .set('Accept', 'application/json')
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err);
                        }
                        if (response.body && response.body !== []) {
                            const scenes_tags = {scenes: response.body, tags: responseT.body};
                            Actions.loadAllScenes(scenes_tags, Orders.CHRONOLOGICAL);
                        }
                    });
        });

}

/**
 * Delete given scene from db and dispatch updates to the stores
 * @param scene
 */
function deleteScene(scene) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.name}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
        });
}

/**
 * Sets specific scene as home (maybe)
 * @param scene
 */
function setHome(scene) {
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/setHome`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
        });
}

/**
 * Retrieves all data, builds Scenes and save them to gameGraph
 * @param gameGraph will contain game data, must be an object
 * @returns {Promise<void>}
 */
async function getAllDetailedScenes(gameGraph) {
    const response = await request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes-all`)
        .set('Accept', 'application/json');
    const raw_scenes = response.body;
    gameGraph['scenes'] = {};
    gameGraph['neighbours'] = [];
    raw_scenes.forEach(s => {
        // neighbours list
        const adj = [];
        // generates transitions
        const transitions = s.transitions.map(transition => {
           return ({ //Transition, but not the immutable one
               uuid: transition.uuid,
               name: transition.name,
               type: transition.type,
               media: JSON.parse(transition.media),
               mask: transition.mask,
               vertices: transition.vertices,
               properties: JSON.parse(transition.properties),
           });
        });

        const switches = s.switches.map(sw => {
            return ({ //Switch, but not the Immutable one
                uuid: sw.uuid,
                name: sw.name,
                type: sw.type,
                media: JSON.parse(sw.media),
                mask: sw.mask,
                vertices : sw.vertices,
                properties: JSON.parse(sw.properties),
            });
        });

        // generates keys
        const keys = s.collectable_keys.map((key) => {
            return ({ //key, not the immutable
                uuid: key.uuid,
                name: key.name,
                type: key.type,
                media: JSON.parse(key.media),
                mask: key.mask,
                vertices: key.vertices,
                properties: JSON.parse(key.properties),
            });
        });

        // generates locks
        const locks = s.locks.map((lock) => {
            return ({ //lock, not the immutable
                uuid: lock.uuid,
                name: lock.name,
                type: lock.type,
                media: JSON.parse(lock.media),
                mask: lock.mask,
                vertices: lock.vertices,
                properties: JSON.parse(lock.properties),
            });
        });

        // generates rules
        const rules = s.rules.map(rule => {
            // check actions to find scene neighbours
            rule.actions.forEach(a => {
                if (a.action === RuleActionTypes.TRANSITION && a.obj_uuid && a.obj_uuid !== null)
                    adj.push(a.obj_uuid);
            });

            // new Rule
            return ({ //Rule, not immutable
                uuid: rule.uuid,
                event: JSON.parse(rule.event),
                condition: JSON.parse(rule.condition),
                actions: rule.actions,
            });
        });

        // generate audios
        /*const audios = s.audio.map( audio => {
            return ({
                uuid: audio.uuid,
                name: audio.name,
                file: audio.file,
                isLocal: audio.isLocal,
                scene: audio.scene,
                loop: audio.loop,
            })
        });*/

        // new Scene
        const newScene = ({ //Scene, not immutable
            uuid: s.uuid,
            name : s.name,
            img : s.img,
            type : s.type,
            index : s.index,
            tag : s.tag,
            objects : {
                transitions : transitions,
                switches : switches,
                collectable_keys: keys,
                locks : locks,
            },
            rules: rules,
            //audio: audios,
        });

        gameGraph['scenes'][newScene.uuid] = newScene;
        gameGraph['neighbours'][newScene.uuid] = adj;
    })
    //console.log(gameGraph);
}

function saveTag(tag, gameID = null){
    let game;
    if(gameID){
        game = gameID;
    }
    else
        game = window.localStorage.getItem("gameID");
    request.put(`${apiBaseURL}/${game}/tags`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({
            uuid: tag.uuid,
            name: tag.name,
            color: tag.color
        })
        .end(function(err, response) {
            if (err && err.status !== 422) {
                return console.error(err);
            }
        });
}

function removeTag(tag_uuid) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/tags/${tag_uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.removeTag(tag_uuid);
        });
}


function conditionParser(c){

    if(!c.hasOwnProperty('operator')){
        return {};
    }

    if(c.hasOwnProperty('condition1')){
        return new SuperCondition(c.uuid, conditionParser(c.condition1), conditionParser(c.condition2), c.operator);
    } else {
        return new Condition(c.uuid, c.obj_uuid, c.state, c.operator);
    }
}

export default {
    getByName: getByName,
    createScene: createScene,
    updateScene: updateScene,
    getAllScenesAndTags: getAllScenesAndTags,
    deleteScene: deleteScene,
    getAllDetailedScenes: getAllDetailedScenes,
    saveTag: saveTag,
    removeTag: removeTag,
};