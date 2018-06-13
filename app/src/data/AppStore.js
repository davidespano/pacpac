import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class AppStore extends ReduceStore {
    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return ActionTypes.EDIT_MODE_ON;
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.EDIT_MODE_ON:
                console.log("EDIT");
                return ActionTypes.EDIT_MODE_ON;
            case ActionTypes.PLAY_MODE_ON:
                console.log("PLAY");
                return ActionTypes.PLAY_MODE_ON
            default:
                return state;
        }
    }
}

export default new AppStore();
