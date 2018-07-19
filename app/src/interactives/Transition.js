import EventTypes from "./EventTypes";
import RuleActionTypes from "./RuleActionTypes"
import InteractiveObject from "./InteractiveObject";

class Transition extends InteractiveObject {

    constructor(media = "", duration = 0, rotationX = 0, rotationY = 0, rotationZ = 0, theta = 10, height = 2) {

        super();

        this.media = media;
        this.duration = duration;
        this.theta = theta;
        this.height = height;

        //default rule is passed to superclass
        this.addNewRule(
            EventTypes.CLICK, //event
            {}, //condition
            {type: RuleActionTypes.TRANSITION, target: '',} //action
        );

        this.setRotation(rotationX, rotationY, rotationZ);
    };

    setRotationX(x){
        this.rotationX = x;
        this.rotation = x + " " + this.rotationY + " " + this.rotationZ;
    }

    setRotationY(y){
        this.rotationY = y;
        this.rotation = this.rotationX + " " + y + " " + this.rotationZ;
    }

    setRotationZ(z){
        this.rotationZ = z;
        this.rotation = this.rotationX + " " + this.rotationY + " " + z;
    }

    setRotation(x, y, z){
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
        this.rotation = x + " " + y + " " + z;
    }

}

export default Transition;