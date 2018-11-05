import Actions from '../actions/Actions'
import settings from './settings'
import scene_utils from "../scene/scene_utils";

const request = require('superagent');

const {apiBaseURL} = settings;

/**
 * Save generic Interactive Object to db
 * @param scene the obj belongs to
 * @param object
 */
function saveObject(scene, object) {
    const field = scene_utils.defineField(object);
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/${field}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: object.uuid,
                name: object.name,
                type: object.type,
                media: object.media,
                vertices: object.vertices,
                properties: JSON.stringify(object.properties),
            })
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

/**
 * Remove generic Interactive Object from db
 * @param scene the obj belongs to
 * @param object
 */
function removeObject(scene, object) {
    const field = scene_utils.defineField(object);
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/${field}/${object.uuid}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .end(function (err, response) {
            if (err) {
                return console.error(err)
            }
            Actions.removeObject(scene, object);
        });
}

/**
 * Save Rule to db
 * @param scene the rule belongs to
 * @param rule
 */
function saveRule(scene, rule) {
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/scenes/${scene.img}/rules`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: rule.uuid,
                object_uuid: rule.object_uuid,
                event: rule.event,
                condition: rule.condition,
                actions: rule.actions
            })
        .end(function (err, response) {
            if (err) {
                console.error(err);
                return false;
            }
            return true;
        });
}

/**
 * Remove Rule from db
 * @param scene the rule belongs to
 * @param rule
 */
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
    saveTransitions: saveObject,
    removeTransition: removeObject,
    saveRule: saveRule,
    removeRule: removeRule,
};