import Transition from "../interactives/Transition";

class Scene {

    constructor(transitions = [], tagName='---', tagColor='black', img){
        this.img = img;
        this.name = img.replace(/\.[^/.]+$/, "");
        this.transitions = transitions;
        this.tag = {
            tagName : tagName,
            tagColor : tagColor,
        }
    }

    addNewTransition(transition = new Transition()){
        this.transitions.push(transition);
    }

}

export default Scene;