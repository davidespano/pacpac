import settings from './settings'
import Immutable from 'immutable';
import Actions from "../actions/Actions";
import EditorState from "../data/EditorState";

let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

function loadDebugState(saveName, flag) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .send(saveName)
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
            if (flag === "loadSave") {
                if (response.body && response.body !== []) {
                    response.body.objectStates.map((rec) => {
                        let s = Immutable.Record({
                            uuid: rec.uuid,
                            state: rec.state,
                        });
                    });

                    let arr = response.body.objectStates.reduce(function (map, obj) {
                        map[obj.uuid] = Object({state: obj.state});
                        return map;
                    }, {});

                    Actions.updateCurrentScene(response.body.currentScene);
                    EditorState.debugRunState = arr;
                }
            } else {
                if (EditorState.debugSaves === undefined) {
                    EditorState.debugSaves = new Immutable.OrderedMap({
                            currentScene: new Immutable.Set

                    });
                }
                let oldSaves = null;
                let newSaves = null;

                if (response.body && response.body !== []) {
                    response.body.forEach(el => {
                            oldSaves = EditorState.debugSaves[el.currentScene];
                            newSaves = new Immutable.Set(oldSaves).add(el.saveName);
                            EditorState.debugSaves[el.currentScene] = newSaves;
                        }
                    );
                }

            }


            /*if (response.body[0] && response.body[0] !== []) {
                response.body.objectStates.map((rec) => {
                    let s = Immutable.Record({
                        uuid: rec.uuid,
                        state: rec.state,
                    });
                });

                let arr = response.body.objectStates.reduce(function (map, obj) {
                    map[obj.uuid] = Object({state: obj.state});
                    return map;
                }, {});

                if(flag === "loadSave") {
                    Actions.updateCurrentScene(response.body.currentScene);
                    EditorState.debugRunState = arr;
                } else if (flag === "getAllSaves") {
                    if(EditorState.debugSaves === undefined) {
                        EditorState.debugSaves = new Immutable.OrderedMap({ currentScene : {
                            currentScene: new Immutable.Set
                        }});
                    }
                    console.log(EditorState.debugSaves);
                    let oldSaves = EditorState.debugSaves[response.body.currentScene];
                    let newSaves = new Immutable.Set(oldSaves).add(response.body.saveName);
                    EditorState.debugSaves[response.body.currentScene] = newSaves;
                }

            }*/

        });
}

function saveDebugState(saveName, sceneUuid, objects) {

    let map = objects.map((v, k) => Object({uuid: k, ...v})).toArray();

    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({
            saveName: saveName,
            currentScene: sceneUuid,
            objectStates: map,
        })
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });
}

export default {
    loadDebugState: loadDebugState,
    saveDebugState: saveDebugState
}