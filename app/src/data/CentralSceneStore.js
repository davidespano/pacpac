import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import MyScene from '../scene/MyScene';
import Transition from "../interactives/Transition";

class CentralSceneStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return null;
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.GET_SCENE_RESPONSE:
                return new MyScene(action.response.name);
            case ActionTypes.ADD_NEW_TRANSITION:

                if(state != null) {
                    state.addNewTransitionToScene(action.obj);

                    return new MyScene(
                        state.img,
                        state.transitions,
                        state.tagName,
                        state.tagColor
                    );

                }

                alert("Nessuna scena selezionata!");

            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
