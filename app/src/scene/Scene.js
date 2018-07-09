import Transition from "../interactives/Transition";

class Scene {

    constructor(transitions = [], name){
        this.name = name;
        this.transitions = transitions;
    }

    addNewTransition(transition = new Transition()){
        this.transitions.push(transition);
    }

}

export default Scene;