import Actions from '../actions/Actions'
import settings from './settings'

const request = require('superagent');

const {apiBaseURL} = settings;
function saveTransition(scene, object) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/transitions`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: object.uuid,
                name: object.name,
                rules: object.rules,
                duration: object.duration,
                vertices: object.vertices
            })
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

function removeTransition(scene, transition) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/transitions/${transition.uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeObject(scene, transition);
        });
}

export default {
    saveTransitions: saveTransition,
    removeTransition: removeTransition
};