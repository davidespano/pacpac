import settings from "./settings";
import Actions from "../actions/Actions";


const request = require('superagent');

const {apiBaseURL} = settings;

function createUpdateLocalAudio(sceneUuid, audio) {
    return request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/audios/scenes/${sceneUuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(audio)
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

function createUpdateGlobalAudio(audio) {
    return request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/audios/`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(audio)
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

function getAllAudios() {
    return request.get(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/audios/`)
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return;
            }
            return response.body;
        });
}

export default{
    createUpdateLocalAudio: createUpdateLocalAudio,
    createUpdateGlobalAudio: createUpdateGlobalAudio,
    getAllAudios: getAllAudios,
}