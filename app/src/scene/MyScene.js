import Transition from "../interactives/Transition";

class MyScene {

    constructor(img, transitions = [], tagName='---', tagColor='black'){
        this.img = img;
        this.name = img.replace(/\.[^/.]+$/, "");
        this.transitions = transitions;
        this.tag = {
            tagName : tagName,
            tagColor : tagColor,
        }
    }

    addNewTransitionToScene(transition = new Transition()){
        this.transitions.push(transition);
    }

}

export default MyScene;