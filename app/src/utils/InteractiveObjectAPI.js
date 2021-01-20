import Actions from '../actions/Actions'
import settings from './settings'
import scene_utils from "../scene/scene_utils";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import ObjectsStore from "../data/ObjectsStore";

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
                audio: JSON.stringify(object.audio),
                vertices: object.vertices,
                visible: object.visible,
                activable: object.activable,
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
function removeObject(scene, object, props) {
    let sceneArray = props.scenes.toArray();
    let objType = null;
    const field = scene_utils.defineField(object);
    switch (object.type){
        case InteractiveObjectsTypes.FLAG:
            objType = InteractiveObjectsTypes.FLAG;
            for (let i = 0, len = sceneArray.length; i < len; i++) {
                let objUuid = sceneArray[i].uuid +"_fl"
                request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${sceneArray[i].name}/${field}/${objUuid}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err)
                        }
                        Actions.removeObject(sceneArray[i], ObjectsStore.getState().get(objUuid), objType);
                    });
            } break;
        case InteractiveObjectsTypes.NUMBER:
            objType = InteractiveObjectsTypes.NUMBER;
            for (let i = 0, len = sceneArray.length; i < len; i++) {
                let objUuid = sceneArray[i].uuid +"_nr"
                request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${sceneArray[i].name}/${field}/${objUuid}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err)
                        }
                        Actions.removeObject(sceneArray[i], ObjectsStore.getState().get(objUuid), objType);
                    });
            } break;
        case InteractiveObjectsTypes.PLAYTIME:
            objType = InteractiveObjectsTypes.PLAYTIME;
            for (let i = 0, len = sceneArray.length; i < len; i++) {
                let objUuid = sceneArray[i].uuid +"_pt"
                request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${sceneArray[i].name}/${field}/${objUuid}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err)
                        }
                        Actions.removeObject(sceneArray[i], ObjectsStore.getState().get(objUuid), objType);
                    });
            } break;
        case InteractiveObjectsTypes.SCORE:
            objType = InteractiveObjectsTypes.SCORE;
            for (let i = 0, len = sceneArray.length; i < len; i++) {
                let objUuid = sceneArray[i].uuid +"_sc"
                request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${sceneArray[i].name}/${field}/${objUuid}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err)
                        }
                        Actions.removeObject(sceneArray[i], ObjectsStore.getState().get(objUuid), objType);
                    });
            } break;
        case InteractiveObjectsTypes.HEALTH:
            objType = InteractiveObjectsTypes.HEALTH;
            for (let i = 0, len = sceneArray.length; i < len; i++) {
                let objUuid = sceneArray[i].uuid +"_hl"
                request.delete(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/interactives/scenes/${sceneArray[i].name}/${field}/${objUuid}`)
                    .set('Accept', 'application/json')
                    .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
                    .end(function (err, response) {
                        if (err) {
                            return console.error(err)
                        }
                        Actions.removeObject(sceneArray[i], ObjectsStore.getState().get(objUuid), objType);
                    });
            } break;
        default:
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
                actions: rule.actions,
                name: rule.name,
                global: rule.global
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
            return true;
        });
}

export default {
    saveObject: saveObject,
    removeObject: removeObject,
    saveRule: saveRule,
    removeRule: removeRule,
};