let uuid = require('uuid');

class Rule {

    constructor({event = null, condition = {}, action = [], id = null}){
        this.event = event;
        this.condition = condition;
        this.actions = action;

        if(id === null){
            this.uuid = uuid.v4();
        }
        else{
            this.uuid = id;
        }
    }
}

export default Rule;