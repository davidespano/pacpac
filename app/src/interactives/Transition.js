import EventTypes from "./rules/EventTypes";
import RuleActionTypes from "./rules/RuleActionTypes"
import InteractiveObject from "./InteractiveObject";


class Transition extends InteractiveObject {

    constructor(name = "", uuid = null, media = "", duration = 2000, vertices = "", rules = []) {

        super(uuid, name, media, vertices, rules);

        this.duration = duration;

        //default rule is passed to superclass, datalistStore is updated

        if(this.rules.length === 0){
            this.addNewRule(
                EventTypes.CLICK, //event
                {}, //condition
                [{type: RuleActionTypes.TRANSITION, target: '---', uuid: this.uuid}] //action
            );
        }

    };

}

export default Transition;