import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Scene from '../scene/Scene';
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
                return new Scene(action.response.name);
            case ActionTypes.ADD_NEW_TRANSITION:
                
                if(state != null) {

                    let tr = new Transition();
                    tr.setName(state.name + '_tr' + (state.transitions.length + 1));
                    state.addNewTransitionToScene(tr);

                    return new Scene(
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
