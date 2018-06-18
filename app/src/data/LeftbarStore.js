import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import LeftbarElement from './LeftbarElement';

class LeftbarStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
       // return Immutable.OrderedMap();
        return [];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_SCENE:
                state.push(
                    new LeftbarElement(action.id,action.name,action.img)
                );
                console.log(state);
                return state;
            default:
                return state;
        }
    }
}

export default new LeftbarStore();
