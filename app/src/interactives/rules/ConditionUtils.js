import SuperCondition from "./SuperCondition";
import Condition from './Condition'
import {Operators} from "./Operators";
import {SuperOperators} from "./Operators";

function evalCondition(c, gameState) {
    if(c === '{}' || c==='"{}"') return true; //quick fix for conditions saved with wrong format
    if(c instanceof SuperCondition){
        switch (c.operator) {
            case SuperOperators.AND: return evalCondition(c.condition1, gameState) && evalCondition(c.condition2, gameState);
            case SuperOperators.OR: return evalCondition(c.condition1, gameState) || evalCondition(c.condition2, gameState);
            case SuperOperators.NOT: return !evalCondition(c.condition1, gameState);
            default:
                console.log('Super operator not yet implemented');
                console.log(c.operator);
        }
    }else if(c instanceof Condition){
        const state = gameState[c.uuid].state;
        switch (c.operator) {
            case Operators.EQUAL: return state == c.state;
            case Operators.NOT_EQUAL: return state != c.state;
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

export default {
    evalCondition: evalCondition
}