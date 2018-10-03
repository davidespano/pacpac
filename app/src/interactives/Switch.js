import InteractiveObject from "./InteractiveObject";
import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes";

class Switch extends InteractiveObject {

    constructor(name = "", uuid = null, media = "", vertices = "", rules = [], defaultState = 'OFF'){

        super(uuid, name, media, vertices, rules);
        this.state = defaultState;

        if(this.rules.length === 0){
            this.addNewRule(
                EventTypes.CLICK, //event
                {}, //condition
                [{type: RuleActionTypes.FLIP_SWITCH, uuid: this.uuid, newState: this.flip()}] //action
            );
        }
    };

    flip(){
        this.state = (this.state === 'OFF')? 'ON' : 'OFF';
        return this.state;
    };
}

export default Switch;