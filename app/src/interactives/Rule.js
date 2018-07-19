class Rule {

    constructor({event = null, condition = {}, action = {}}){
        this.event = event;
        this.condition = condition;
        this.action = action;
    }
}

export default Rule;