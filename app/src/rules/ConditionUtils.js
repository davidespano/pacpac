import SuperCondition from "./SuperCondition";
import Condition from './Condition'
import {Operators} from "./Operators";
import {SuperOperators} from "./Operators";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import create_scene2 from "../components/aframe/create_scene2";

//Se è coinvolto il tastierino passo un parametro aggiuntivo keypad che mi serve per la funzione checkKeypadValue
export default function evalCondition(c, gameState, keypad=null) {
    if(JSON.stringify(c) == "{}" || c === '{}' || c==='"{}"') return true; //quick fix for conditions saved with wrong format
    if(c instanceof SuperCondition || c.hasOwnProperty("condition1")){
        switch (c.operator) {
            case SuperOperators.AND: return evalCondition(c.condition1, gameState) && evalCondition(c.condition2, gameState);
            case SuperOperators.OR: return evalCondition(c.condition1, gameState) || evalCondition(c.condition2, gameState);
            case SuperOperators.NOT: return !evalCondition(c.condition1, gameState);
            default:
                console.log('Super operator not yet implemented');
                console.log(c.operator);
        }
    }else if(c instanceof Condition || c.hasOwnProperty("obj_uuid")){
        if(c.obj_uuid == "" || c.obj_uuid == null || !c.operator || c.state == "") return true; //se i campi della condizione semplice
        //sono vuoti non crasha ma restituisce true
        if(c.obj_uuid===InteractiveObjectsTypes.COMBINATION){
            //se controllo che la combinazione non sia corretta la funzione deve restituire il contrario
            if(c.operator=== Operators.NOT_EQUAL){
                return !create_scene2.checkKeypadValue(keypad)
            }
            return create_scene2.checkKeypadValue(keypad)
        }

        //devo controllare lo stato del selettore
        if(c.operator===Operators.IS_SELECTOR_STATE){
            let selector = gameState[c.obj_uuid];
            let selectorState = selector.state; //stato effettivo del selettore
            let ruleState = c.state; //stato richiesto dalla regola
            if(ruleState==selectorState){
                return true
            }
            return false
        }

        let state = gameState[c.obj_uuid].state;
        if(state === undefined){
            state = gameState[c.obj_uuid][c.state.toLowerCase()];
        }
        switch (c.operator) {
            case Operators.EQUAL:
            case Operators.EQUAL_NUM:
                return state == c.state;
            case Operators.NOT_EQUAL:
            case Operators.NOT_EQUAL_NUM:
                return state != c.state;
            case Operators.LESS_THAN: return state < c.state;
            case Operators.LESS_EQUAL: return state <= c.state;
            case Operators.GREATER_THAN: return state > c.state;
            case Operators.GREATER_EQUAL: return state >= c.state;
            case Operators.IN: return state >= c.state.lower && state <= c.state.upper();
            default:
                console.log('operator not yet implemented');
                console.log(c.operator);
        }

    }else {
        console.log("The parameter is not a condition");
        console.log(c);
    }
}
