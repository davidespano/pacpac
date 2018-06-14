import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import LeftbarElement from './LeftbarElement';

class LeftbarStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return new Array();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_SCENE:
                //console.log("non funziona")
                return state.push(
                    new LeftbarElement(action.id, action.name, action.img)
                );
            default:
                return state;
        }
    }
}

export default new LeftbarStore();
