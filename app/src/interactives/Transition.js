import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes"
import InteractiveObject from "./InteractiveObject";
import Rule from "./Rule";

class Transition extends InteractiveObject {

    constructor(media = "", duration = 0, rotationX = 0, rotationY = 0, rotationZ = 0, theta = 10, height = 2) {

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
        this.rotation = rotationX + " " + rotationY + " " + rotationZ;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.rotationZ = rotationZ;
        this.theta = theta;
        this.height = height;

    };

}

export default Transition;