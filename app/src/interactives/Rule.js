class Rule {

    constructor({event = {}, condition = {}, action = {}}){
        this.event = event;
        this.condition = condition;
        this.action = action;
    }
}

export default Rule;