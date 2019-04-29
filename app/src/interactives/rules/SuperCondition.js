import {SuperOperators} from "./Operators";

class SuperCondition {

    constructor(uuid = null, condition1 = null, condition2 = null, operator = SuperOperators.AND){
        this.uuid = uuid;
        this.operator = operator;
        this.condition1 = condition1;
        this.condition2 = condition2;
    };

}

export default SuperCondition;