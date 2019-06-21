import settings from './settings'
import Immutable from 'immutable';
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
                response.body.objectsStates.map((rec) => {
                    let s = Immutable.Record({
                        uuid: rec.uuid,
                        name: rec.name,
                        type: rec.type,
                        media: JSON.parse(rec.media),
                        mask: rec.mask,
                        audio: JSON.parse(rec.audio),
                        vertices: rec.vertices,
                        properties: JSON.parse(rec.properties),
                    });
                    console.log(response.body);
                    return response.body;
                });
            }

        });
}

function saveDebugState(sceneUuid, objects) {

    let map = objects.map((v,k) => Object({uuid:k,...v})).toArray()

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