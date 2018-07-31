import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';


class ObjectsFilterStore  extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return "scene";
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.OBJECTS_FILTER:
                return action.filter;
            default:
                return state;
        }
    }
}

export default new ObjectsFilterStore();
