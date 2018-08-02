import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class ModeTypeStore extends ReduceStore {
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
                return ActionTypes.PLAY_MODE_ON;
            case ActionTypes.GEOMETRY_MODE_ON:
                console.log("Edit Geometry");
                return ActionTypes.GEOMETRY_MODE_ON;
            default:
                return state;
        }
    }
}

export default new ModeTypeStore();
