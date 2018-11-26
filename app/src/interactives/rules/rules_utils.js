import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import Condition from "./Condition";
let uuid = require('uuid');

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
                object_uuid : object.uuid,
                event : EventTypes.CLICK,
                actions : [{
                    uuid : uuid.v4(),
                    type : RuleActionTypes.TRANSITION,
                    target : "---",
                }],
            });
            break;
        case InteractiveObjectsTypes.SWITCH:
            r = Rule({
                uuid : uuid.v4(),
                object_uuid : object.uuid,
                event: EventTypes.CLICK,
                actions : [{
                    uuid : uuid.v4(),
                    type : RuleActionTypes.FLIP_SWITCH,
                }]
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
    a[property] = value;
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