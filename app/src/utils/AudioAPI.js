import settings from "./settings";
import Actions from "../actions/Actions";
import Audio from "../audio/Audio";


const request = require('superagent');

const {apiBaseURL} = settings;

function createUpdateSpatialAudio(sceneUuid, audio) {
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
            console.log(response.body);
            response.body.forEach(audio => {
                if(!audio.isSpatial){
                    let a = Audio({
                        uuid: audio.uuid,
                        name: audio.name,
                        file: audio.file,
                        isSpatial: audio.isSpatial,
                        scene: audio.scene,
                        loop: audio.loop,
                    });
                    Actions.receiveAudio(a);
                }
            })
        });
}

function deleteAudio(uuid){
    return request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/audios/${uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

export default{
    createUpdateSpatialAudio: createUpdateSpatialAudio,
    createUpdateGlobalAudio: createUpdateGlobalAudio,
    getAllAudios: getAllAudios,
    deleteAudio: deleteAudio,
}