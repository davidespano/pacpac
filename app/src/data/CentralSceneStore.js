import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import MyScene from '../scene/MyScene';

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
                return action.scene;
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return action.scene;
            case ActionTypes.ADD_NEW_TRANSITION:

                state.addNewTransitionToScene(action.obj);

                return new MyScene(
                    state.img,
                    state.transitions,
                    state.tagName,
                    state.tagColor
                );

            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
