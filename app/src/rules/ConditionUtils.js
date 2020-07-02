import SuperCondition from "./SuperCondition";
import Condition from './Condition'
import {Operators} from "./Operators";
import {SuperOperators} from "./Operators";

export default function evalCondition(c, gameState) {
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
