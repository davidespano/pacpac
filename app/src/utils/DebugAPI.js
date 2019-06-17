import Actions from '../actions/Actions'
import settings from './settings'
import Scene from "../scene/Scene";
import Transition from "../interactives/Transition";
import Rule from "../interactives/rules/Rule";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";
import Switch from "../interactives/Switch";
import Key from "../interactives/Key";
import Lock from "../interactives/Lock"
import Orders from "../data/Orders";
import Action from "../interactives/rules/Action";
import Immutable from 'immutable';
import stores_utils from "../data/stores_utils";
import SuperCondition from "../interactives/rules/SuperCondition";
import Condition from "../interactives/rules/Condition";
import Audio from "../audio/Audio";
let uuid = require('uuid');

const request = require('superagent');

const {apiBaseURL} = settings;

function loadDebugState(sceneID) {
    request.get()

}

function saveDebugState(name) {
    let id = uuid.v4();
    request.post(`${apiBaseURL}/${window.localStorage.getItem("gameID")}/debug/createDebugState`)
        .set('Accept', 'application/json')
        .set('authorization', `Token ${window.localStorage.getItem('authToken')}`)
        .send({uuid: id, name: name})
        .end(function (err, response) {
        if (err) {
            return console.error(err);
        }});
}

export default {
    loadDebugState : loadDebugState,
    saveDebugState : saveDebugState
}