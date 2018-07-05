import Rule from "./Rule";

class InteractiveObject {

    constructor(name, rules = []){
        this.name = name;
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