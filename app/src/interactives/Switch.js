import InteractiveObject from "./InteractiveObject";
import EventTypes from "./rules/EventTypes";
import RuleActionTypes from "./rules/RuleActionTypes";

class Switch extends InteractiveObject {

    constructor(name = "", uuid = null, media = "", vertices = "", rules = [], defaultState = 'OFF'){

        super(uuid, name, media, vertices, rules);
        this.state = defaultState;

        if(this.rules.length === 0){
            this.addNewRule(
                EventTypes.CLICK, //event
                {}, //condition
                [{type: RuleActionTypes.FLIP_SWITCH, uuid: this.uuid}] //action
            );
        }
    };

    flip(){
        this.state = (this.state === 'OFF')? 'ON' : 'OFF';
        return this.state;
    };
}

export default Switch;