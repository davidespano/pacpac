import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../rules/Rule";
import RuleActionTypes from "../rules/RuleActionTypes";
import Switch from "../interactives/Switch";
import Key from "../interactives/Key";
import Lock from "../interactives/Lock"
import Orders from "../data/Orders";
import Action from "../rules/Action";
import Immutable from 'immutable';
import stores_utils from "../data/stores_utils";
import SuperCondition from "../rules/SuperCondition";
import Condition from "../rules/Condition";
import Audio from "../audio/Audio";
import PointOfInterest from "../interactives/PointOfInterest";
import Counter from "../interactives/Counter";
import Blind from "../interactives/Blind";
import Door from "../interactives/Door";
import AirConditioner from "../interactives/AirConditioner";
import Light from "../interactives/Light";
import MotionDetector from "../interactives/MotionDetector";
import PowerOutlet from "../interactives/PowerOutlet";
import DSwitch from "../interactives/DSwitch";
import Sensor from "../interactives/Sensor";
import Siren from "../interactives/Siren";
import SmokeDetector from "../interactives/SmokeDetector";
import Speaker from "../interactives/Speaker";
import ScenesStore from "../data/ScenesStore";
import EditorStateStore from "../data/EditorStateStore";
let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

/**
 * Retrieves scene data from db and generates a new Scene object
 * @param name of the scene
 * @param order actual order of the scenes in editor
 * @param gameId to load a specific game
 */
function getByName(name, order = null, gameId=null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    request.get(`${apiBaseURL}/${id}/scenes/${name}`)
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
            let points_uuids = [];
            let counters_uuids = [];
            let blinds_uuids = [];
            let doors_uuids = [];
            let acs_uuids = [];
            let lights_uuids = [];
            let motiondects_uuids = [];
            let powoutlets_uuids = [];
            let dswitches_uuids = [];
            let sensors_uuids = [];
            let sirens_uuids = [];
            let smokedects_uuids = [];
            let speakers_uuids = [];

            let scene_type = response.body.type;


            // generates transitions and saves them to the objects store
            response.body.transitions.map((transition) => {
                transitions_uuids.push(transition.uuid); // save uuid
                let t = Transition(getProperties(transition));
                Actions.receiveObject(t, scene_type);
            });

            // generates switches and saves them to the objects store
            response.body.switches.map((sw) => {
                switches_uuids.push(sw.uuid); //save uuid
                let s = Switch(getProperties(sw));
                Actions.receiveObject(s, scene_type);
            });

            // generates key and saves them to the objects store
            response.body.collectable_keys.map((key) => {
                collectable_keys_uuids.push(key.uuid); //save uuid
                let k = Key(getProperties(key));
                Actions.receiveObject(k, scene_type);
            });

            // generates lock and saves them to the objects store
            response.body.locks.map((lock) => {
                locks_uuids.push(lock.uuid); //save uuid
                let l = Lock(getProperties(lock));
                Actions.receiveObject(l, scene_type);
            });

            // generates points and saves them to the objects store
            if(response.body.points){
                response.body.points.map((point) => {
                    points_uuids.push(point.uuid); //save uuid
                    let p = PointOfInterest(getProperties(point));
                    Actions.receiveObject(p, scene_type);
                });
            }

            // generates counters and saves them to the objects store
            if(response.body.counters){
                response.body.counters.map((counter) => {
                    counters_uuids.push(counter.uuid); //save uuid
                    let c = Counter(getProperties(counter));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates blinds and saves them to the objects store
            if(response.body.blinds){
                response.body.blinds.map((blind) => {
                    blinds_uuids.push(blind.uuid); //save uuid
                    let c = Blind(getProperties(blind));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates blinds and saves them to the objects store
            if(response.body.doors){
                response.body.doors.map((obj) => {
                    doors_uuids.push(obj.uuid); //save uuid
                    let c = Door(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates acs and saves them to the objects store
            if(response.body.acs){
                response.body.acs.map((obj) => {
                    acs_uuids.push(obj.uuid); //save uuid
                    let c = AirConditioner(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates lights and saves them to the objects store
            if(response.body.lights){
                response.body.lights.map((obj) => {
                    lights_uuids.push(obj.uuid); //save uuid
                    let c = Light(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates motiondects and saves them to the objects store
            if(response.body.motiondects){
                response.body.motiondects.map((obj) => {
                    motiondects_uuids.push(obj.uuid); //save uuid
                    let c = MotionDetector(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates powoutlets and saves them to the objects store
            if(response.body.powoutlets){
                response.body.powoutlets.map((obj) => {
                    powoutlets_uuids.push(obj.uuid); //save uuid
                    let c = PowerOutlet(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates switches and saves them to the objects store
            if(response.body.dswitches){
                response.body.dswitches.map((obj) => {
                    dswitches_uuids.push(obj.uuid); //save uuid
                    let c = DSwitch(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates sensors and saves them to the objects store
            if(response.body.sensors){
                response.body.sensors.map((obj) => {
                    sensors_uuids.push(obj.uuid); //save uuid
                    let c = Sensor(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates sirens and saves them to the objects store
            if(response.body.sirens){
                response.body.sirens.map((obj) => {
                    sirens_uuids.push(obj.uuid); //save uuid
                    let c = Siren(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates smokedects and saves them to the objects store
            if(response.body.smokedects){
                response.body.smokedects.map((obj) => {
                    smokedects_uuids.push(obj.uuid); //save uuid
                    let c = SmokeDetector(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

            // generates speakers and saves them to the objects store
            if(response.body.speakers){
                response.body.speakers.map((obj) => {
                    speakers_uuids.push(obj.uuid); //save uuid
                    let c = Speaker(getProperties(obj));
                    Actions.receiveObject(c, scene_type);
                });
            }

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
                   volume: audio.volume,
                   isSpatial: audio.isSpatial,
                   scene: audio.scene,
                   loop: audio.loop,
                   vertices: audio.vertices,
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
                isAudioOn : response.body.isAudioOn,
                isVideoInALoop: response.body.isVideoInALoop,
                tag : tag,
                music: response.body.music,
                sfx: response.body.sfx,
                objects : {
                    transitions : transitions_uuids,
                    switches : switches_uuids,
                    collectable_keys: collectable_keys_uuids,
                    locks: locks_uuids,
                    points: points_uuids,
                    counters: counters_uuids,

                    // IoT Devices:
                    blinds: blinds_uuids,
                    doors: doors_uuids,
                    acs: acs_uuids,
                    lights: lights_uuids,
                    motiondects: motiondects_uuids,
                    powoutlets: powoutlets_uuids,
                    dswitches: dswitches_uuids,
                    sensors: sensors_uuids,
                    sirens: sirens_uuids,
                    smokedects: smokedects_uuids,
                    speakers: speakers_uuids,
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
                audios: [],
                objects: {
                    transitions: [],
                    switches: [],
                    collectable_keys: [],
                    locks: [],
                    points: [],
                    counters: [],

                    // IoT Devices:
                    blinds: [],
                    doors: [],
                    acs: [],
                    lights: [],
                    motiondects: [],
                    powoutlets: [],
                    dswitches: [],
                    sensors: [],
                    sirens: [],
                    smokedects: [],
                    speakers: [],
                }
            });

            Actions.receiveScene(newScene, order);
        });
}

/**
 * Update a scene inside db
 * @param scene
 */
function updateScene(scene, tag) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/updateScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({scene: scene, tag: tag})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });
}

/**
 * Retrieves all data from db and sends it to stores for scenes generations
 * @param gameId to load a specific game
 */
function getAllScenesAndTags(gameId = null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    request.get(`${apiBaseURL}/${id}/tags`)
        .set('Accept', 'application/json')
        .end(function (err, responseT) {
            if (err) {
                return console.error(err);
            }
            if (responseT.body && responseT.body !== [])
                request.get(`${apiBaseURL}/${id}/scenes`)
                    .set('Accept', 'application/json')
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err);
                        }
                        if (response.body && response.body !== []) {
                            const scenes_tags = {scenes: response.body, tags: responseT.body};
                            Actions.loadAllScenes(scenes_tags, Orders.CHRONOLOGICAL, gameId);
                        } else {
                            responseT.body.forEach( tag => {
                                Actions.receiveTag(tag);
                            })
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
 * Sets specific scene as home
 * @param sceneId
 * @param updateStore true if we want to update the store as well
 */
function setHomeScene(sceneId, updateStore=true) {
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${sceneId}/setHomeScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            if(updateStore){
                Actions.setHomeScene(sceneId);
            }
        });
}

/**
 * Retrieves home Scene from db
 * @gameId load a specific game
 */
function getHomeScene(gameId = null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    request.get(`${apiBaseURL}/${id}/getHomeScene`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                Actions.setHomeScene(null);
            }
            Actions.setHomeScene(response.body.uuid);
        });
}

/**
 * Retrieves all data, builds Scenes and save them to gameGraph
 * @param gameGraph will contain game data, must be an object
 * @param gameId to load a specific scene
 * @returns {Promise<void>}
 */
async function getAllDetailedScenes(gameGraph, gameId = null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    const response = await request.get(`${apiBaseURL}/${id}/scenes-all`)
        .set('Accept', 'application/json');
    const raw_scenes = response.body;
    gameGraph['scenes'] = {};
    gameGraph['neighbours'] = [];
    gameGraph['objects']= new Map();
    raw_scenes.forEach(s => {
        // neighbours list
        const adj = [];
        // generates transitions
        const transitions = s.transitions.map(transition => {
            let t = getProperties(transition);
            gameGraph['objects'].set(t.uuid, t);
            return t;
        });

        const switches = s.switches.map(sw => {
            let s = getProperties(sw);
            gameGraph['objects'].set(s.uuid, s);
            return s;
        });

        // generates keys
        const keys = s.collectable_keys.map((key) => {
            let k = getProperties(key);
            gameGraph['objects'].set(k.uuid, k);
            return k;
        });

        // generates locks
        const locks = s.locks.map((lock) => {
            let l = getProperties(lock);
            gameGraph['objects'].set(l.uuid, l);
            return l;
        });

        // generates points
        const points = !s.points? [] : s.points.map((point) => {
            let pt = getProperties(point);
            gameGraph['objects'].set(pt.uuid, pt);
            return pt;
        });

        // generates counters
        const counters = !s.counters? [] : s.counters.map((counter) => {
            let c = getProperties(counter);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // IoT Devices

        // generates blinds
        const blinds = !s.blinds? [] : s.blinds.map((blind) => {
            let c = getProperties(blind);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates doors
        const doors = !s.doors? [] : s.doors.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates acs
        const acs = !s.acs? [] : s.acs.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates lights
        const lights = !s.lights? [] : s.lights.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates motiondects
        const motiondects = !s.motiondects? [] : s.motiondects.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates powoutlets
        const powoutlets = !s.powoutlets? [] : s.powoutlets.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates switches
        const dswitches = !s.dswitches? [] : s.dswitches.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates sensors
        const sensors = !s.sensors? [] : s.sensors.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates sirens
        const sirens = !s.sirens? [] : s.sirens.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates smokedects
        const smokedects = !s.smokedects? [] : s.smokedects.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
        });

        // generates speakers
        const speakers = !s.speakers? [] : s.speakers.map((obj) => {
            let c = getProperties(obj);
            gameGraph['objects'].set(c.uuid, c);
            return c;
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
        const audios = s.audios.map( audio => {
            return ({
                uuid: audio.uuid,
                name: audio.name,
                file: audio.file,
                volume: audio.volume,
                isSpatial: audio.isSpatial,
                scene: audio.scene,
                loop: audio.loop,
                vertices: audio.vertices,
            })
        });
        // new Scene
        const newScene = ({ //Scene, not immutable
            uuid: s.uuid,
            name : s.name,
            img : s.img,
            type : s.type,
            index : s.index,
            isAudioOn : s.isAudioOn,
            isVideoInALoop: s.isVideoInALoop,
            tag : s.tag,
            music : s.music,
            sfx: s.sfx,
            objects : {
                transitions : transitions,
                switches : switches,
                collectable_keys: keys,
                locks : locks,
                points: points,
                counters: counters,

                // IoT Devices
                blinds: blinds,
                doors: doors,
                acs: acs,
                lights: lights,
                motiondects: motiondects,
                powoutlets: powoutlets,
                dswitches: dswitches,
                sensors: sensors,
                sirens: sirens,
                smokedects: smokedects,
                speakers: speakers,
            },
            rules : rules,
            audios : audios,
        });

        gameGraph['scenes'][newScene.uuid] = newScene;
        gameGraph['neighbours'][newScene.uuid] = adj;
    })
    //console.log(gameGraph);
}

async function getHome(gameId = null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    const response = await request.get(`${apiBaseURL}/${id}/getHomeScene`)
        .set('Accept', 'application/json');

    return response.body.uuid
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

function getProperties(obj){
    return {
        uuid: obj.uuid,
        name: obj.name,
        type: obj.type,
        media: JSON.parse(obj.media),
        mask: obj.mask,
        vertices: obj.vertices,
        audio: JSON.parse(obj.audio),
        properties: JSON.parse(obj.properties),
        visible: obj.visible,
    };
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
    setHomeScene: setHomeScene,
    getHomeScene: getHomeScene,
    getHome: getHome,
};
