import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes"
import InteractiveObject from "./InteractiveObject";
import Rule from "./Rule";

class Transition extends InteractiveObject {

    constructor(media = "", duration = 0, rotation = '0 0 0', theta = 10, height = 2) {

        super();

        //default rule is passed to superclass
        this.addNewRule(new Rule({
            event: EventTypes.CLICK,
            action: {
                type: RuleActionTypes.TRANSITION,
                target: '',
            }
        }));

        this.media = media;
        this.duration = duration;
        this.rotation = rotation; // format stringa con tre numeri separati da uno spazio, mettere tre campi diversi
        this.theta = theta;
        this.height = height;

    };

}

export default Transition;