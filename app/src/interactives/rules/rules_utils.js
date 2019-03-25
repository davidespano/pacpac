import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
import Immutable from 'immutable';
import Action from "./Action";
let uuid = require('uuid');

const PLAYER = 'player';

/**
 * Generates a default rule depending on the given object
 * @param object
 */
function generateDefaultRule(object){
    let r;
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: RuleActionTypes.TRANSITION,
                })]),
            });
            break;
        case InteractiveObjectsTypes.SWITCH:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: RuleActionTypes.FLIP_SWITCH,
                    obj_uuid: object.uuid,
                })]),
            });
            break;
        case InteractiveObjectsTypes.KEY:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: RuleActionTypes.COLLECT_KEY,
                    obj_uuid: object.uuid,
                })]),
            });
            break;
        case InteractiveObjectsTypes.LOCK:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: PLAYER,
                    action: RuleActionTypes.UNLOCK_LOCK,
                    obj_uuid: object.uuid,
                })]),
            });
            break;
        default:
            return;
    }
    return r;
}

/**
 * Set property of a specific action belonging to the Rule and returns updated Rule
 * @param rule
 * @param index is the index of the action inside the actions array
 * @param property to set
 * @param value of the property
 */
function setAction(rule, index, property, value){

    let actions = rule.get('actions');
    let a = actions[index];
    a = a.set(property, value);
    actions[index] = a;
    return rule.set('actions', actions);
}

function setProperty(rule, property, value){
    return rule.set(property, value);
}


export default {
    generateDefaultRule : generateDefaultRule,
    setAction : setAction,
    setProperty : setProperty,
};