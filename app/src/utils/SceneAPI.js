import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../interactives/rules/Rule";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";
import Switch from "../interactives/Switch";
import Orders from "../data/Orders";

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
            let rules_uuids = [];

            // generates transitions and saves them to the objects store
            response.body.transitions.map((transition) => {
                transitions_uuids.push(transition.uuid); // save uuid
                let t = Transition({
                    uuid: transition.uuid,
                    name: transition.name,
                    type: transition.type,
                    media: transition.media,
                    mask: transition.mask,
                    vertices: transition.vertices,
                    properties: JSON.parse(transition.properties),
                });
                Actions.receiveObject(t);
            });

            // generates switches and saves them to the objects store
            response.body.switches.map((sw) => {
                switches_uuids.push(sw.uuid); //save uuid
                let s = Switch({
                    uuid: sw.uuid,
                    name: sw.name,
                    type: sw.type,
                    media: sw.media,
                    mask: sw.mask,
                    vertices: sw.vertices,
                    properties: JSON.parse(sw.properties),
                });
                Actions.receiveObject(s);
            });

            // generates rules and saves them to the rules store
            response.body.rules.map(rule => {
                // check actions to find scene neighbours
                rule.actions.forEach(a => {
                    if (a.type === RuleActionTypes.TRANSITION && a.target && a.target !== '---')
                        adj.push(a.target);
                });

                rules_uuids.push(rule.uuid); // save uuid

                // new Rule
                let r = Rule({
                    uuid: rule.uuid,
                    object_uuid: rule.object_uuid,
                    event: rule.event,
                    condition: JSON.parse(rule.condition),
                    actions: rule.actions,
                });
                Actions.receiveRule(r);
            });

            // new Scene object
            let newScene = Scene({
                name : response.body.name.replace(/\.[^/.]+$/, ""),
                img : response.body.name,
                type : response.body.type,
                index : response.body.index,
                tag : response.body.tag.uuid,
                objects : {
                    transitions : transitions_uuids,
                    switches : switches_uuids,
                },
                rules : rules_uuids,
            });

            Actions.receiveScene(newScene, order);

        });
}

/**
 * Creates new Scene inside db and stores
 * @param name
 * @param index
 * @param type
 * @param tag
 * @param order of scenes
 */
function createScene(name, index, type, tag, order) {
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name, index: index, type: type, tag: tag})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            
            // new Scene object
            let newScene = Scene({
                name : name.replace(/\.[^/.]+$/, ""),
                img : name,
                type : type,
                index : index,
                tag : tag,
                rules: [],
                objects: {
                    transitions: [],
                    switches: [],
                }
            });

            Actions.receiveScene(newScene, order);
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
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            Actions.removeScene(scene);
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
               media: transition.media,
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
                media: sw.media,
                mask: sw.mask,
                vertices : sw.vertices,
                properties: JSON.parse(sw.properties),
            });
        });

        // generates rules
        const rules = s.rules.map(rule => {
            // check actions to find scene neighbours
            rule.actions.forEach(a => {
                if (a.type === RuleActionTypes.TRANSITION && a.target && a.target !== '---' )
                    adj.push(a.target);
            });

            // new Rule
            return ({ //Rule, not immutable
                uuid: rule.uuid,
                object_uuid: rule.object_uuid,
                event: rule.event,
                condition: JSON.parse(rule.condition),
                actions: rule.actions,
            });
        });


        // new Scene
        const newScene = ({ //Scene, not immutable
            name : s.name.replace(/\.[^/.]+$/, ""),
            img : s.name,
            type : s.type,
            index : s.index,
            tag : s.tag,
            objects : {
                transitions : transitions,
                switches : switches,
            },
            rules: rules,
        });

        gameGraph['scenes'][newScene.img] = newScene;
        gameGraph['neighbours'][newScene.img] = adj;
    })
    //console.log(gameGraph);
}

function saveTag(tag){
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/tags`)
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


export default {
    getByName: getByName,
    createScene: createScene,
    getAllScenesAndTags: getAllScenesAndTags,
    deleteScene: deleteScene,
    getAllDetailedScenes: getAllDetailedScenes,
    saveTag: saveTag,
    removeTag: removeTag,
};