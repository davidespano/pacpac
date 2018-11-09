import {SuperOperators} from "./Operators";

class SuperCondition {

    constructor(operator = SuperOperators.AND, condition1 = null, condition2 = null){
        this.operator = operator;
        this.condition1 = condition1;
        this.condition2 = condition2;
    };

}

export default SuperCondition;