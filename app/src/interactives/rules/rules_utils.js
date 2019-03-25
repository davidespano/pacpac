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


function addEmptyAction(rule){
     let list = rule.get('actions');
     list = list.push(Action({
         uuid: uuid.v4(),
         subj_uuid: PLAYER,
     }));
     rule = rule.set('actions', list);
     console.log(rule)
     return rule;
}

function deleteAction(rule, action){
    let index = -1;
    for(var i = 0; i < rule.actions.size; i++){
        if(rule.actions.get(i).uuid == action){
            let list = rule.get('actions');
            list = list.delete(index);
            rule = rule.set('actions', list);
            return rule;
        }
    }
    return null;
}


function setProperty(rule, property, value){
    return rule.set(property, value);
}


export default {
    generateDefaultRule : generateDefaultRule,
    setProperty : setProperty,
    addEmptyAction : addEmptyAction,
    deleteAction : deleteAction,
};