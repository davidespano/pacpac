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
                console.log(response.body);
                return console.error(err);
            }

            if (response.body && response.body !== []) {
                //Creazione del debugRunState
                let debugRunState = {};
                // response.body.objectStates è un array di oggetti di gioco
                for(let obj of response.body.objectStates){
                    let {saveName, saveDescription, uuid, ...properties} = obj;
                    debugRunState[uuid] = properties;
                }

                Actions.updateCurrentScene(response.body.currentScene);
                Actions.updateDebugRunState('runState', {...debugRunState});
            }
            return null;

        });
}

function saveDebugState(saveName, saveDescription, sceneUuid, objects) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/state`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({
            saveName: saveName,
            saveDescription: saveDescription,
            currentScene: sceneUuid,
            objectStates: objects,
        })
        .end(function (err, response) {
            if (err) {
                return console.error(err);
            } else {
                console.log(response.body);
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

            if (response.body && response.body !== []) {
                /* debugSaves è una Immutable.OrderedMap dove <K, V> = <uuid scene, Immutable.Set of K saves> */
                let debugSaves = new Immutable.OrderedMap();
                response.body.forEach(save => {
                    if(!debugSaves.has(save.currentScene)){
                        debugSaves = debugSaves.set(save.currentScene, new Immutable.Set());
                    }
                    debugSaves = debugSaves.update(save.currentScene, set => set.add(save));
                });
                console.log("DebugAPI/debugSaves", debugSaves.toArray());

                Actions.loadDebugSaves(debugSaves);
                return null;
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