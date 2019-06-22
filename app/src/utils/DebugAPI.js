import settings from './settings'
import Immutable from 'immutable';
import Actions from "../actions/Actions";
import EditorState from "../data/EditorState";
let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

function loadDebugState() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }

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

        });
}

function saveDebugState(sceneUuid, objects) {

    let map = objects.map((v,k) => Object({uuid:k,...v})).toArray();

    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({
            currentScene: sceneUuid,
            objectStates: map,
        })
        .end(function (err, response) {
        if (err) {
            return console.error(err);
        }});
}

export default {
    loadDebugState : loadDebugState,
    saveDebugState : saveDebugState
}