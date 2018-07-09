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
            case ActionTypes.GET_SCENE_RESPONSE:
                return new Scene(action.response.name);
            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
