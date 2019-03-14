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
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${scene.name}/${field}`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: object.uuid,
                name: object.name,
                type: object.type,
                media: JSON.stringify(object.media),
                mask: object.mask,
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
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${scene.name}/${field}/${object.uuid}`)
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
    request.put(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/rules/scenes/${scene.name}/rules`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send(
            {
                uuid: rule.uuid,
                event: JSON.stringify(rule.event),
                condition: JSON.stringify(rule.condition),
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
    request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/rules/scenes/${scene.name}/rules/${rule.uuid}`)
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
    saveObject: saveObject,
    removeObject: removeObject,
    saveRule: saveRule,
    removeRule: removeRule,
};