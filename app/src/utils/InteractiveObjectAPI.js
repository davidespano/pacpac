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
                duration: object.properties.duration,
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

function saveRule(scene, object) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/rules`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: object.uuid,
                event: object.event,
                condition: object.condition,
                actions: object.actions
            })
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

function removeRule(scene, rule) {
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/rules/${rule.uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeRule(scene, rule);
        });
}

export default {
    saveTransitions: saveTransition,
    removeTransition: removeTransition,
    saveRule: saveRule,
    removeRule: removeRule,
};