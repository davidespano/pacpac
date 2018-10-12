import Operators from "Operators";

class Condition {

    constructor(uuid = "", operator = Operators.EQUAL, state = ""){
        this.uuid = uuid;
        this.operator = operator;
        this.state = state;
    }
}