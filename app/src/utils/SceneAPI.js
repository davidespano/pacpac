import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../interactives/rules/Rule";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";

const request = require('superagent');

const {apiBaseURL} = settings;

//get scene by name
function getByName(name, scene = null) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }

            let transitions = response.body.transitions;

            if (transitions)
                transitions = transitions.map((transition) => {
                    transition.media = transition.rules[0].actions[0].target;
                    return transition;
                });

            transitions = transitions ? transitions : [];
            if (scene == null) {

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
                        transitions : transitions,
                    },
                });

                Actions.receiveScene(newScene);
                transitions.forEach(t => {
                    Actions.addNewObject(t);
                });

            } else {
                scene.objects.transitions = transitions;
                Actions.updateScene(scene);
                Actions.updateCurrentScene(scene);
            }

        });
}

/*
//check if a scene already exists
function existsByName(name) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${name}`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            return response.status === 200;
        });
}
*/

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
                name : response.body.name.replace(/\.[^/.]+$/, ""),
                img : response.body.name,
                type : response.body.type,
                index : response.body.index,
                tag : {
                    tagName : response.body.tagName,
                    tagColor : response.body.tagColor,
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
        const adj = [];
        const transitions = s.transitions.map(t => {
            return new Transition(t.name, t.uuid, t.media, t.duration, t.vertices, t.rules.map(r => {
                r.actions.forEach(a => {
                    if (a.type = RuleActionTypes.TRANSITION && a.target)
                        adj.push(a.target);
                });
                return new Rule({id: r.uuid, event: r.event, condition: r.condition, action: r.actions})
            }))
        });
        transitions.forEach(t => {
            Actions.addNewObject(t);
        });

        // new Scene object
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