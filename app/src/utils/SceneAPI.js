import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../interactives/rules/Rule";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";

const request = require('superagent');

const {apiBaseURL} = settings;

//get scene by name
function getByName(name) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            const adj = [];
            const transitions_uuids = [];
            const rules_uuids = [];

            // generates transitions and saves them to the objects store
            response.body.transitions.map((transition) => {

                transitions_uuids.push(transition.uuid);
                let t = Transition({
                    uuid: transition.uuid,
                    name: transition.name,
                    type: transition.type,
                    media: transition.media,
                    vertices: transition.vertices,
                    properties: transition.properties,
                });
                Actions.receiveObject(t);
            });

            // generates rules and saves them to the rules store
            response.body.rules.map(rule => {
                // check actions to find scene neighbours
                rule.actions.forEach(a => {
                    if (a.type = RuleActionTypes.TRANSITION && a.target)
                        adj.push(a.target);
                });

                rules_uuids.push(rule.uuid);

                // new Rule
                let r = Rule({
                    uuid: rule.uuid,
                    object_uuid: rule.object_uuid,
                    event: rule.event,
                    condition: rule.condition,
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
                tag : {
                    tagName : response.body.tagName,
                    tagColor : response.body.tagColor,
                },
                objects : {
                    transitions : transitions_uuids,
                },
                rules : rules_uuids,
            });

            Actions.receiveScene(newScene);

        });
}

//create new scene inside db
function createScene(name, index, type, tagColor, tagName) {
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/addScene`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({name: name, index: index, type: type, tagColor: tagColor, tagName: tagName})
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            
            // new Scene object
            const newScene = Scene({
                name : name.replace(/\.[^/.]+$/, ""),
                img : name,
                type : type,
                index : index,
                tag : {
                    tagName : tagName,
                    tagColor : tagColor,
                },
            });

            Actions.receiveScene(newScene);
        });
}

//reloads all scenes
function getAllScenes() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            if (response.body && response.body !== [])
                Actions.loadAllScenes(response.body);
        });
}

//delete scene
function deleteScene(scene) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeScene(scene);
            Actions.updateCurrentScene(null);
        });
}

//set home scene
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

//get a detailed list of all the scenes
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
           return Transition({
               uuid: transition.uuid,
               name: transition.name,
               type: transition.type,
               media: transition.media,
               vertices: transition.vertices,
               properties: transition.properties,
           });
        });

        // generates rules
        const rules = s.rules.map(rule => {
            // check actions to find scene neighbours
            rule.actions.forEach(a => {
                if (a.type = RuleActionTypes.TRANSITION && a.target)
                    adj.push(a.target);
            });

            // new Rule
            return Rule({
                uuid: rule.uuid,
                object_uuid: rule.object_uuid,
                event: rule.event,
                condition: rule.condition,
                actions: rule.actions,
            });
        });


        // new Scene
        const newScene = Scene({
            name : s.name.replace(/\.[^/.]+$/, ""),
            img : s.name,
            type : s.type,
            index : s.index,
            tag : {
                tagName : s.tagName,
                tagColor : s.tagColor,
            },
            objects : {
                transitions : transitions,
            },
            rules: rules,
        });

        gameGraph['scenes'][newScene.img] = newScene;
        gameGraph['neighbours'][newScene.img] = adj;
    })
    //console.log(gameGraph);
}

export default {
    getByName: getByName,
    createScene: createScene,
    getAllScenes: getAllScenes,
    deleteScene: deleteScene,
    getAllDetailedScenes: getAllDetailedScenes
};