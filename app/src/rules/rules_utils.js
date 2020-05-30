import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Rule from "./Rule";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";
import Immutable from 'immutable';
import _ from 'lodash'
import Action from "./Action";
import Condition from "./Condition";
import SuperCondition from "./SuperCondition";
import Values from "./Values";
import {Operators} from "./Operators";
let uuid = require('uuid');

/**
 * Generates a default rule depending on the given object
 * @param object
 */
function generateDefaultRule(object, scene){
    let r, r1, r2;
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            r = Rule({
                uuid : uuid.v4(),
                name : 'regola della transizione ' + object.name,
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
                name : 'regola dell\'interruttore ' + object.name,
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                condition : new Condition(uuid.v4(), object.uuid, Values.ON, Operators.EQUAL),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: object.uuid,
                    action: RuleActionTypes.CHANGE_STATE,
                    obj_uuid: Values.OFF
                })]),
            });
            r2 = Rule({
                uuid : uuid.v4(),
                name : 'regola dell\'interruttore ' + object.name + '_2',
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: EventTypes.CLICK,
                    obj_uuid: object.uuid,
                }),
                condition : new Condition(uuid.v4(), object.uuid, Values.OFF, Operators.EQUAL),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: object.uuid,
                    action: RuleActionTypes.CHANGE_STATE,
                    obj_uuid: Values.ON
                })])
            });
            return [r1, r2];
        case InteractiveObjectsTypes.KEY:
            r = Rule({
                uuid : uuid.v4(),
                name : 'regola della chiave ' + object.name,
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
                name : 'regola del lucchetto ' + object.name,
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
                name : 'regola del punto di interesse ' + object.name,
                event: Action({uuid: uuid.v4()}),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: RuleActionTypes.LOOK_AT,
                    obj_uuid: object.uuid,
                })]),
            });
            break;
        case InteractiveObjectsTypes.COUNTER:
            r = Rule({
                uuid : uuid.v4(),
                name : 'regola del contatore ' + object.name,
                event : Action({uuid: uuid.v4()}),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: object.uuid,
                    action: RuleActionTypes.INCREASE,
                })]),
            });
            break;
        case InteractiveObjectsTypes.KEYPAD:
            r = Rule({
                uuid: uuid.v4(),
                name : 'regola del tastierino ' + object.name,
                event: Action({}),
                actions : Immutable.List([Action({uuid: uuid.v4()})]),
            });
            break;
        case InteractiveObjectsTypes.TIMER:
            r1 = Rule({
                uuid: uuid.v4(),
                name : 'regola del timer ' + object.name,
                event: Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.PLAYER,
                    action: RuleActionTypes.ENTER_SCENE,
                    obj_uuid: scene.uuid,
                }),
                actions : Immutable.List([Action({
                    uuid: uuid.v4(),
                    subj_uuid: InteractiveObjectsTypes.GAME,
                    action: RuleActionTypes.TRIGGERS,
                    obj_uuid: object.uuid,
                })]),
            });
            r2 =Rule({
                uuid: uuid.v4(),
                name : 'regola del timer ' + object.name + '_2',
                event: Action({
                    uuid: uuid.v4(),
                    subj_uuid: object.uuid,
                    action: RuleActionTypes.REACH_TIMER,
                    obj_uuid: 0,
                }),
                actions : Immutable.List([Action({uuid: uuid.v4()})]),
            });
            return [r1, r2];
        case InteractiveObjectsTypes.HEALTH:
            r = Rule({
                uuid : uuid.v4(),
                name : 'regola della ' + object.name,
                event : Action({
                    uuid: uuid.v4(),
                    subj_uuid: object.uuid,
                    action: RuleActionTypes.INCREASE,
                    obj_uuid: 0,
                }),
                actions : Immutable.List([Action({uuid: uuid.v4()})]),
                global : true
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

/**
 * Funzione che guarda tutte le regole e controlla che siano complete
 * @param props
 * @returns se tutte le regole sono complete un array vuoto, altrimenti un array di array così:
 * {[[nome_regola, event/condition/actions, role (subject, object...)],[...]]}
 * con tutti i casi di parti di regola incomplete
 */
function checkCompletionsRules(props){
    //devo controllare che tutte le regole del gioco siano complete
    let result = [];

    props.rules.map(item =>  { //per ogni regola
        let event=item.event;
        let condition =item.condition;
        let actions =item.actions._tail.array[0];

        //prendo per l'event [nome_regola, event, role (subject, object...)]
        let event_result=returnNullRulesPart(item.name, event, "Quando");
        //prendo per l'action [nome_regola, action, role (subject, object...)]
        let action_result = returnNullRulesPart(item.name, actions, "Allora");
        let condition_result=[];

        if(condition instanceof SuperCondition){ //se ho una supercondition cerco ricorsivamente
            let simple_conditions =[];
            returnSimpleCondition(condition, simple_conditions);

            //se sono in questo if significa che simple_conditions è un array con più condizioni, quindi devo
            //chiamare la funzione returnNullRulesPart per ciascuna di esse
            for(var i =0; i<simple_conditions.length; i++){
                condition_result.push(returnNullRulesPart(item.name, simple_conditions[i], "Se"));
            }
            condition_result=condition_result.flat(); //faccio la flat per avere i risultati uniformi
        }
        else if(condition instanceof Condition){ //se è instance of Object non c'è una condizione
            condition_result = returnNullRulesPart(item.name, condition, "Se");
        }

        let toPush=[];

        //fondo i risultati
        if(event_result.length>0){ //se c'è qualcosa
            if(toPush.length===0){ //se non è già presente nessun elemento metto come primo elemento
                //il nome della regola, lo faccio qui altrimenti devo poi rimanipolare la stringa
                toPush.push(item.name + ": " + event_result)
            }
            else {
                toPush.push(event_result)
            }
        }
        if(action_result.length>0) {
            if(toPush.length===0){
                toPush.push(item.name + ": " + action_result)
            }
            else {
                toPush.push(action_result)
            }
        }
        if(condition_result.length>0) {
            if(toPush.length===0){
                toPush.push(item.name + ": " + condition_result)
            }
            else {
                toPush.push(condition_result)
            }
        }

        if(toPush.length>0){
            result.push(toPush.join().toString()) //faccio la join in modo tale da avere per ogni regola i risultati formattati
        }

    }
    );
    return result;
}

/**
 * Cerca ricorsivamente all'interno delle super condizioni fino a trovare la condizione semplice e la restituisce
 * @param superCondition
 * @param result
 * @returns {array di condizioni semplici}
 */
function returnSimpleCondition(superCondition, result){
    if(superCondition.condition1 instanceof SuperCondition){
        returnSimpleCondition(superCondition.condition1, result);
    }
    else{
        result.push(superCondition.condition1)
    }
    if(superCondition.condition2 instanceof SuperCondition){
        returnSimpleCondition(superCondition.condition2, result);
    }
    else{
        result.push(superCondition.condition2)
    }
    return result;
}


/**
 * @param ruleName
 * @param rulePart
 * @param key: event/condition/actions
 * @returns {[ruleName, event/condition/actions, role (subject, object...), event/condition/actions, role....]}
 */
function returnNullRulesPart (ruleName, rulePart, key){
    let results=[];

    if(key === "Se"){ //in caso di condition le parti della regola hanno un altro nome
        let obj= getValue(rulePart, "obj_uuid");
        let operator = getValue(rulePart, "operator");
        let state = getValue(rulePart, "state");

        let toPush = [];
        //gli spazi sono per non formattarlo successivamente nella lista ul
        if(obj ===undefined || obj === null || obj ===""){
            toPush.push([" "+key+ ": soggetto vuoto"])
        }
        if(operator ===undefined || operator === null|| operator ===""){
            toPush.push([" "+key+ ": stato vuoto"])
        }
        if(state ===undefined || state === null|| state ===""){
            toPush.push([" "+key+ ": valore vuoto"])
        }
        if(toPush.length>0){ //se non faccio questo controllo aggiunge anche le regole non vuote
            results.push(toPush)
        }
    }
    else{ //in caso di azioni e eventi si chiamano subj, obj, action
        let subj = getValue(rulePart, "subj_uuid");
        let action = getValue(rulePart, "action");
        let obj = getValue(rulePart, "obj_uuid");

        let toPush = [];

        if(subj ===undefined || subj === null|| subj ===""){
            toPush.push([" "+key+ ": soggetto vuoto"])
        }
        if(action ===undefined || action === null|| action ===""){
            toPush.push([" "+key+ ": azione vuota"])
        }
        if(obj ===undefined || obj === null|| obj ===""){
            toPush.push([" "+key+ ": oggetto vuoto"])
        }

        if(toPush.length>0){ //se non faccio questo controllo aggiunge anche le regole non vuote
            results.push(toPush)
        }

    }

    return results;
}


/**
 * @param object
 * @param key
 * @returns {*}
 * Cerca nel record degli oggetti, se lo trova restituisce il valore, altrimenti undefined
 */
function getValue (object, key) {
    return key.split(".").reduce(function (obj, val) {
        return (typeof obj == "undefined" || obj === null || obj === "") ? obj : (_.isString(obj[val]) ? obj[val].trim() : obj[val]);}, object);
}


export default {
    generateDefaultRule : generateDefaultRule,
    setProperty : setProperty,
    addEmptyAction : addEmptyAction,
    deleteAction : deleteAction,
    addEmptyCondition : addEmptyCondition,
    deleteCondition : deleteCondition,
    checkCompletionsRules : checkCompletionsRules,
};