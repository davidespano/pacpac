import Rule from "./Rule";

class InteractiveObject {

    constructor(rules = []){
        this.rules = rules;
    }

    addNewRule(event, condition, action){
        this.rules.push(new Rule({
            event: event,
            condition: condition,
            action: action
        }));
    }

}

export default InteractiveObject;