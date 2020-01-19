import SuperCondition from "./SuperCondition";
import Condition from './Condition'
import {Operators} from "./Operators";
import {SuperOperators} from "./Operators";

function evalCondition(c, gameState) {
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
        if(c.obj_uuid == "" || c.obj_uuid == null || !c.operator || c.state == "") return true;

        const state = gameState[c.obj_uuid].state;
        switch (c.operator) {
            case Operators.EQUAL_OPEN: return state.open == c.state;
            case Operators.NOT_EQUAL_OPEN: return state.open != c.state;
            case Operators.EQUAL_LOCK: return state.lock == c.state;
            case Operators.NOT_EQUAL_LOCK: return state.lock != c.state;
            case Operators.EQUAL:
                if (state instanceof Object)
                    console.log(state, c.state);
                    return state.state == c.state;
                return state == c.state;
            case Operators.EQUAL_NUM:
                return state == c.state;
            case Operators.NOT_EQUAL:
                if (state instanceof Object)
                    return state.state != c.state;
                return state != c.state;
            case Operators.NOT_EQUAL_NUM:
                return state != c.state;
            case Operators.LESS_THAN: return state < c.state;
            case Operators.LESS_EQUAL: return state <= c.state;
            case Operators.GREATER_THAN: return state > c.state;
            case Operators.GREATER_EQUAL: return state >= c.state;
            case Operators.IN: return state >= c.state.lower && state <= c.state.upper();
            case Operators.TEMP_EQUAL_NUM: return state.temperature == c.state;
            case Operators.TEMP_NOT_EQUAL_NUM: return state.temperature != c.state;
            case Operators.TEMP_LESS_THAN: return state.temperature < c.state;
            case Operators.TEMP_LESS_EQUAL: return state.temperature <= c.state;
            case Operators.TEMP_GREATER_THAN: return state.temperature > c.state;
            case Operators.TEMP_GREATER_EQUAL: return state.temperature >= c.state;
            case Operators.VOLUME_EQUAL_NUM: return state.volume == c.state;
            case Operators.VOLUME_NOT_EQUAL_NUM: return state.volume != c.state;
            case Operators.VOLUME_LESS_THAN: return state.volume < c.state;
            case Operators.VOLUME_LESS_EQUAL: return state.volume <= c.state;
            case Operators.VOLUME_GREATER_THAN: return state.volume < c.state;
            case Operators.VOLUME_GREATER_EQUAL: return state.volume >= c.state;
            case Operators.SHUTTER_EQUAL_NUM: return state.roller == c.state;
            case Operators.SHUTTER_NOT_EQUAL_NUM: return state.roller != c.state;
            case Operators.SHUTTER_LESS_THAN: return state.roller < c.state;
            case Operators.SHUTTER_LESS_EQUAL: return state.roller <= c.state;
            case Operators.SHUTTER_GREATER_THAN: return state.roller < c.state;
            case Operators.SHUTTER_GREATER_EQUAL: return state.roller >= c.state;
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
