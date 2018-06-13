import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import LeftbarElement from './LeftbarElement';

class LeftbarStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return [];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_SCENE:
                return state.add(
                    new LeftbarElement(action.id, action.name, action.img)
                );
            default:
                return state;
        }
    }
}

export default new LeftbarStore();
