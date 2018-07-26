import Transition from "../interactives/Transition";

class MyScene {

    constructor(img, tagName='---', tagColor='black', transitions = []){
        this.img = img;
        this.name = img.replace(/\.[^/.]+$/, "");
        this.tag = {
            tagName : tagName,
            tagColor : tagColor,
        }
        this.transitions = transitions;
    }

    addNewTransitionToScene(transition = new Transition()){
        this.transitions.push(transition);
    }

}

export default MyScene;