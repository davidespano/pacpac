import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
import Immutable from 'immutable';
import Action from "./Action";
import Condition from "./Condition";
import SuperCondition from "./SuperCondition";
import Values from "./Values";
let uuid = require('uuid');

/**
 * Generates a default rule depending on the given object
 * @param object
 */
function generateDefaultRule(object){
    let r, r1, r2;
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: RuleActionTypes.TRANSITION,
                })]),
            });
            break;
        case InteractiveObjectsTypes.SWITCH:
            r1 = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                condition : new Condition(uuid.v4(), object.uuid, Values.ON),
                actions : Immutable.List([Action({uuid: uuid.v4()})]),
            });
            r2 = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                condition : new Condition(uuid.v4(), object.uuid, Values.OFF),
                actions : Immutable.List([Action({uuid: uuid.v4()})]),
            });
            return [r1, r2];
        case InteractiveObjectsTypes.KEY:
            r = Rule({
                uuid : uuid.v4(),
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
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
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: RuleActionTypes.UNLOCK_LOCK,
                    obj_uuid: object.uuid,
                })]),
            });
            break;
        case InteractiveObjectsTypes.POINT_OF_INTEREST:
            r = Rule({
                uuid: uuid.v4(),
                event: Action({}),
                actions: Immutable.List(),
            });
            break;
        case InteractiveObjectsTypes.KEYPAD:
            r = Rule({
                uuid: uuid.v4(),
                event: Action({}),
                actions: Immutable.List(),
            });
            break;
        default:
            return;
    }
    return r;
}

/**
 * Add new empty action to given rule, returns rule updated
 * @param rule
 * @returns {*}
 */
function addEmptyAction(rule){
     let list = rule.get('actions');
     let index = list.size > 0 ? list.get(list.size-1).get('index') + 1 : 0;
     list = list.push(Action({
         uuid: uuid.v4(),
         subj_uuid: InteractiveObjectsTypes.PLAYER,
         index: index,
     }));
     rule = rule.set('actions', list);
     return rule;
}

/**
 * Removes given action from the rule, returns updated rule (or null if rule does not contain given action)
 * @param rule
 * @param action
 * @returns {*}
 */
function deleteAction(rule, action){
    for(var i = 0; i < rule.actions.size; i++){
        if(rule.actions.get(i).uuid === action.uuid){
            let list = rule.get('actions');
            list = list.delete(i);
            rule = rule.set('actions', list);
            return rule;
        }
    }
    return null;
}


/**
 * Add new empty condition to given rule, returns rule updated
 * @param rule
 * @returns {*}
 */
function addEmptyCondition(rule){
    let c = new Condition(uuid.v4());

    if (rule.condition instanceof Condition || rule.condition instanceof SuperCondition){
        c = new SuperCondition(uuid.v4(), rule.condition, new Condition(uuid.v4()));
    }

    rule = rule.set('condition', c);

    return rule;
}

/**
 * Remove specific condition from the rule
 * @param rule
 * @param conditionToDelete
 * @returns {rule}
 */
function deleteCondition(rule, conditionToDelete){
    let newCondition = {};

    if(rule.condition instanceof SuperCondition){
        newCondition = findConditionInsideSuperCondition(rule.condition, conditionToDelete)
    }

    rule = rule.set('condition', newCondition);
    return rule;
}

/**
 * Search recursively inside a supercondition and returns given condition
 * @param s supercondition
 * @param c condition
 * @returns {*}
 */
function findConditionInsideSuperCondition(s, c){
    if(s.condition1 instanceof Condition && s.condition1.uuid === c.uuid){
        return s.condition2;
    }
    if(s.condition2 instanceof Condition && s.condition2.uuid === c.uuid){
        return s.condition1;
    }
    if(s.condition1 instanceof SuperCondition){
        s.condition1 = findConditionInsideSuperCondition(s.condition1, c);
    }
    if(s.condition2 instanceof SuperCondition){
        s.condition2 = findConditionInsideSuperCondition(s.condition2, c);
    }

    return s;
}

/**
 * Set rule property to given value
 * @param rule
 * @param property
 * @param value
 */
function setProperty(rule, property, value){
    return rule.set(property, value);
}


export default {
    generateDefaultRule : generateDefaultRule,
    setProperty : setProperty,
    addEmptyAction : addEmptyAction,
    deleteAction : deleteAction,
    addEmptyCondition : addEmptyCondition,
    deleteCondition : deleteCondition,
};