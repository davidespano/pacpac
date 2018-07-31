let uuid = require('uuid');

class Rule {

    constructor({event = null, condition = {}, action = []}){
        this.event = event;
        this.condition = condition;
        this.action = action;
        this.uuid = uuid.v4();
    }
}

export default Rule;