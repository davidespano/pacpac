import settings from './settings'
import Immutable from 'immutable';
import Actions from "../actions/Actions";
import EditorState from "../data/EditorState";

let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

function loadDebugState(saveName) {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state/${saveName}`)
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

function saveDebugState(saveName, saveDescription, sceneUuid, objects) {

    let map = objects.map((v, k) => Object({uuid: k, ...v})).toArray();

    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({
            saveName: saveName,
            saveDescription: saveDescription,
            currentScene: sceneUuid,
            objectStates: map,
        })
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }
        });
}

function getAllSaves() {
    request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            }

            /* Nessun errore nella richiesta, nel body della response c'è un array che contiene
               tutti i salvataggi del gioco corrente, di tutte le scene */
            console.log(response.body);

            if (EditorState.debugSaves === undefined) {
              /*  EditorState.debugSaves = new Immutable.OrderedMap({
                    currentScene: new Immutable.Set

                });  EditorState.debugSaves = new Immutable.Map();
                let s = EditorState.debugSaves;
                EditorState.debugSaves = s.set("t", new Immutable.Set());*/
            }
            let oldSaves = null;
            let newSaves = null;

            if (response.body && response.body !== []) {
                let debugSaves = new Immutable.Map();

                response.body.forEach(el => {

                    if(!debugSaves.contains(el.currentScene)){
                        debugSaves = debugSaves.set(el.currentScene, new Immutable.Set());
                    }

                    debugSaves = debugSaves.set(
                        el.currentScene,
                        debugSaves.get(el.currentScene).add(el.saveName));


                    /*oldSaves = EditorState.debugSaves[el.currentScene];
                    newSaves = new Immutable.Set(oldSaves).add(el.saveName);
                    //state = state.set(el.currentScene, newSaves)
                    EditorState.debugSaves[el.currentScene] = newSaves;*/
                    }
                );
                return debugSaves;
            } else {
                console.log("Nessun salvataggio presente");
                return null;
            }
        });
}

export default {
    loadDebugState: loadDebugState,
    saveDebugState: saveDebugState,
    getAllSaves: getAllSaves,
}