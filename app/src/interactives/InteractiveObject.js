import Rule from "./Rule";

class InteractiveObject {

    constructor(rules = [], name){
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

    setName(name){
        this.name = name;
    }

}

export default InteractiveObject;