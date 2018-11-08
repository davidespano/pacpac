import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Scene from '../scene/Scene';

class CentralSceneStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return null;
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.RECEIVE_SCENE:
                return action.scene.name;
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return action.name;
            case ActionTypes.REMOVE_SCENE:
                return null;
            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
