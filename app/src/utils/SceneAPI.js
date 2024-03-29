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
import ScenesStore from "../data/ScenesStore";
import EditorStateStore from "../data/EditorStateStore";
import Textbox from "../interactives/Textbox";
import Button from "../interactives/Button";
import Selector from "../interactives/Selector";
import Keypad from "../interactives/Keypad";
import Timer from "../interactives/Timer";
import Score from "../interactives/Score";
import Health from "../interactives/Health";
import Flag from "../interactives/Flag";
import Number from "../interactives/Number";
import PlayTime from "../interactives/PlayTime";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import {createGlobalObjectForNewScene} from "../components/interface/Topbar";
import GraphViewContent from "../components/interface/GraphViewContent";
let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

/**
 * Retrieves scene data from db and generates a new Scene object
 * @param name of the scene
 * @param order actual order of the scenes in editor
 * @param gameId to load a specific game
 */
function getByName(name, order = null, gameId=null, creation = true) {
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
            let rules_names = [];
            let rules_uuids = [];
            let audio_uuids = [];
            let points_uuids = [];
            let counters_uuids = [];
            let textboxes_uuids = [];
            let buttons_uuids = [];
            let selectors_uuids = [];
            let keypads_uuids = [];
            let timers_uuids = [];
            let playtime_uuids = [];
            let score_uuids = [];
            let health_uuids = [];
            let flags_uuids = [];
            let numbers_uuids = [];

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

            // generates textboxes and saves them to the objects store
            if(response.body.textboxes) {
                response.body.textboxes.map((textbox) => {
                    textboxes_uuids.push(textbox.uuid); //save uuid
                    let tx = Textbox(getProperties(textbox));
                    Actions.receiveObject(tx, scene_type);
                });
            }

            if(response.body.buttons) {
                response.body.buttons.map((button) => {
                    buttons_uuids.push(button.uuid); //save uuid
                    let bt = Button(getProperties(button));
                    Actions.receiveObject(bt, scene_type);
                });
            }

            if(response.body.selectors) {
                response.body.selectors.map((selector) => {
                    selectors_uuids.push(selector.uuid); //save uuid
                    let sl = Selector(getProperties(selector));
                    Actions.receiveObject(sl, scene_type);
                });
            }

            if(response.body.keypads) {
                response.body.keypads.map((keypad) => {
                    keypads_uuids.push(keypad.uuid); //save uuid
                    let kp = Keypad(getProperties(keypad));
                    Actions.receiveObject(kp, scene_type);
                });
            }

            if(response.body.timers) {
                response.body.timers.map((timer) => {
                    timers_uuids.push(timer.uuid); //save uuid
                    let tm = Timer(getProperties(timer));
                    Actions.receiveObject(tm, scene_type);
                });
            }

            if(response.body.score) {
                response.body.score.map((score) => {
                    score_uuids.push(score.uuid); //save uuid
                    let sc = Score(getProperties(score));
                    Actions.receiveObject(sc, scene_type);
                });
            }

            if(response.body.health) {
                response.body.health.map((health) => {
                    health_uuids.push(health.uuid); //save uuid
                    let hl = Health(getProperties(health));
                    Actions.receiveObject(hl, scene_type);
                });
            }

            if(response.body.flags) {
                response.body.flags.map((flag) => {
                    flags_uuids.push(flag.uuid); //save uuid
                    let fl = Flag(getProperties(flag));
                    Actions.receiveObject(fl, scene_type);
                });
            }

            if(response.body.numbers) {
                response.body.numbers.map((number) => {
                    numbers_uuids.push(number.uuid); //save uuid
                    let nr = Number(getProperties(number));
                    Actions.receiveObject(nr, scene_type);
                });
            }

            if(response.body.playtime) {
                response.body.playtime.map((playtime) => {
                    playtime_uuids.push(playtime.uuid); //save uuid
                    let pt = PlayTime(getProperties(playtime));
                    Actions.receiveObject(pt, scene_type);
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
                rules_names.push(rule.name);
                let event;
                try{
                    event = JSON.parse(rule.event)
                    // new Rule
                    let r = Rule({
                        uuid: rule.uuid,
                        name: rule.name,
                        event: Action({
                            uuid: event.uuid,
                            subj_uuid: event.subj_uuid,
                            action: event.action,
                            obj_uuid: event.obj_uuid,
                        }),
                        condition: conditionParser(JSON.parse(rule.condition)),
                        actions: actions,
                        global: rule.global,
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
                    textboxes: textboxes_uuids,
                    buttons: buttons_uuids,
                    selectors: selectors_uuids,
                    keypads: keypads_uuids,
                    timers: timers_uuids,
                    score: score_uuids,
                    health: health_uuids,
                    flags: flags_uuids,
                    numbers: numbers_uuids,
                    playtime: playtime_uuids,
                },
                rules : rules_uuids,
                audios : audio_uuids,
            });
            if (order == null)
                order = Orders.ALPHABETICAL;
            Actions.receiveScene(newScene, order, creation);


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
 * @param props
 */
function createScene(name, img, index, type, tag, order, props) {
    let id = uuid.v4();
    //ci dev'essere una sola ghost scene e deve avere quell'id
    if(name==='Ghost Scene'){
        id = 'ghostScene'
    }
    let newScene = null;
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({uuid: id, name: name, img: img, index: index, type: type, tag: tag})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }

            // new Scene object
            newScene = Scene({
                uuid: id,
                name : name,
                img : img,
                type : type,
                index : index,
                tag : tag,
                rules: [],
                audios: [],
                isVideoInALoop: false,
                isAudioOn: false,
                objects: {
                    transitions: [],
                    switches: [],
                    collectable_keys: [],
                    locks: [],
                    points: [],
                    counters: [],
                    textboxes: [],
                    buttons:[],
                    keypads: [],
                    selectors: [],
                    playtime: [],
                    score: [],
                    health: [],
                    flags: [],
                    numbers: [],
                    timers: [],
                }
            });

            Actions.receiveScene(newScene, order);
            updateScene(newScene, tag);

            //se è la prima scena del gioco che creo diventa home scene, la ghost scene verrà creata dopo questa prima scena
            if (props.scenes.size < 2 && id != 'ghostScene'){
                setHomeScene(id);
            }
            if(props.scenes.first() !=undefined) //non dovrebbe essere necessario creare gli oggetti flag e number in questo frangente
            {
                if(props.scenes.first().objects.playtime.length > 0) {
                    createGlobalObjectForNewScene(props, newScene, InteractiveObjectsTypes.PLAYTIME);
                }
                if(props.scenes.first().objects.score.length > 0) {
                    createGlobalObjectForNewScene(props, newScene, InteractiveObjectsTypes.SCORE);
                }
                if(props.scenes.first().objects.health.length > 0) {
                    createGlobalObjectForNewScene(props, newScene, InteractiveObjectsTypes.HEALTH);
                }
                if(props.scenes.first().objects.flags.length > 0) {
                    createGlobalObjectForNewScene(props, newScene, InteractiveObjectsTypes.FLAG);
                }
                if(props.scenes.first().objects.numbers.length > 0) {
                    createGlobalObjectForNewScene(props, newScene, InteractiveObjectsTypes.NUMBER);
                }
            }
            //mi serve solo per i nuovi giochi
            if(props.scenes.size ===0 && props.scenes.get('ghostScene')===undefined){
                createScene('Ghost Scene', "null", 0, '2D', 'default',
                    Orders.CHRONOLOGICAL, props);
                console.log("created ghost scene")
            }
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
                            Actions.loadAllScenes(scenes_tags, EditorStateStore.getState().get("scenesOrder"), gameId);
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



async function getNodes(gameId=null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    const response= await request.get(`${apiBaseURL}/${id}/getNodes`)
        .set('Accept', 'application/json');

    return response.body;
}


function setNodes(nodedata) {
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/setNodes`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                nodes: JSON.stringify(nodedata)
            }
        )
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });
}

function delNodes(gameId=null) {
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    request.delete(`${apiBaseURL}/${id}/delNodes`)
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
    readScene(gameGraph, raw_scenes);
    //console.log(gameGraph);
}

async function getDetailedScene(sceneId, gameGraph, gameId = null){
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

    const response = await request.get(`${apiBaseURL}/${id}/scenes/uuid/${sceneId}`)
        .set('Accept', 'application/json');
    const raw_scenes = response.body;
    readScene(gameGraph, raw_scenes);
}



function readScene(gameGraph, raw_scenes) {
    gameGraph['scenes'] = {};
    gameGraph['neighbours'] = [];
    gameGraph['objects'] = new Map();
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

        const textboxes = s.textboxes.map(tx => {
            let t = getProperties(tx);
            gameGraph['objects'].set(t.uuid, t);
            return t;
        });

        const buttons = s.buttons.map(bt => {
            let b = getProperties(bt);
            gameGraph['objects'].set(b.uuid, b);
            return b;
        });

        const keypads = s.keypads.map(kp => {
            let k = getProperties(kp);
            gameGraph['objects'].set(k.uuid, k);
            return k;
        });

        const selectors = s.selectors.map(sl => {
            let s = getProperties(sl);
            gameGraph['objects'].set(s.uuid, s);
            return s;
        });

        const score = s.score.map(sc => {
            let ss = getProperties(sc);
            gameGraph['objects'].set(ss.uuid, ss);
            return ss;
        });

        const health = s.health.map(hl => {
            let h = getProperties(hl);
            gameGraph['objects'].set(h.uuid, h);
            return h;
        });

        const flags = s.flags.map(fl => {
            let f = getProperties(fl);
            gameGraph['objects'].set(f.uuid, f);
            return f;
        });

        const numbers = s.flags.map(nr => {
            let n = getProperties(nr);
            gameGraph['objects'].set(n.uuid, n);
            return n;
        });

        const playtime = s.playtime.map(pt => {
            let p = getProperties(pt);
            gameGraph['objects'].set(p.uuid, p);
            return p;
        });

        // generates timers
        const timers = s.timers.map(tm => {
            let t = getProperties(tm);
            gameGraph['objects'].set(t.uuid, t);
            return t;
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
        const points = !s.points ? [] : s.points.map((point) => {
            let pt = getProperties(point);
            gameGraph['objects'].set(pt.uuid, pt);
            return pt;
        });

        // generates counters
        const counters = !s.counters ? [] : s.counters.map((counter) => {
            let c = getProperties(counter);
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
                name: rule.name,
                global: rule.global,
            });
        });

        // generate audios
        const audios = s.audios.map(audio => {
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
            name: s.name,
            img: s.img,
            type: s.type,
            index: s.index,
            isAudioOn: s.isAudioOn,
            isVideoInALoop: s.isVideoInALoop,
            tag: s.tag,
            music: s.music,
            sfx: s.sfx,
            objects: {
                transitions: transitions,
                switches: switches,
                collectable_keys: keys,
                locks: locks,
                points: points,
                counters: counters,
                textboxes: textboxes,
                buttons: buttons,
                keypads: keypads,
                selectors: selectors,
                score: score,
                playtime: playtime,
                health: health,
                timers: timers,
                flags: flags,
                numbers: numbers,
            },
            rules: rules,
            audios: audios,
        });

        gameGraph['scenes'][newScene.uuid] = newScene;
        gameGraph['neighbours'][newScene.uuid] = adj;
    })
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
        activable: obj.activable,
    };
}

export default {
    getByName: getByName,
    createScene: createScene,
    updateScene: updateScene,
    getAllScenesAndTags: getAllScenesAndTags,
    deleteScene: deleteScene,
    getAllDetailedScenes: getAllDetailedScenes,
    getDetailedScene: getDetailedScene,
    setNodes:setNodes,
    getNodes:getNodes,
    delNodes:delNodes,
    saveTag: saveTag,
    removeTag: removeTag,
    setHomeScene: setHomeScene,
    getHomeScene: getHomeScene,
    getHome: getHome,
};