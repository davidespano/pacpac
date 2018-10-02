import Transition from "../interactives/Transition";

class MyScene {

    constructor(img, type = '3D', tagName='---', tagColor='black',  transitions = [], index = 0){
        this.img = img;
        this.type = type;
        this.index = index;
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