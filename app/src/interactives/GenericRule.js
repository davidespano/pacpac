class GenericRule {

    constructor(){
        this.event =  {};
        this.condition = {};
        this.action = {};
    }

    constructor(event, condition, action){
        this.event = event;
        this.condition = condition;
        this.action = action;
    }
}

export default new GenericRule();