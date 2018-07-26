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
            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
