import Rule from "./Rule";
let uuid = require('uuid');

class InteractiveObject {

    constructor(rules = [], name){
        this.name = name;
        this.rules = rules;
        this.uuid = uuid.v4();
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