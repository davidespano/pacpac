import {Operators} from "./Operators";

class Condition {

    constructor(uuid = "", obj_uuid = "", state = "", operator = Operators.EQUAL){
        this.uuid = uuid;
        this.obj_uuid = obj_uuid;
        this.operator = operator;

        if(operator === Operators.IN){
            let s = state.split("");
            this.lower = s[0];
            this.upper = s[1];
        } else {
            this.state = state;
        }

    }
}

export default Condition;