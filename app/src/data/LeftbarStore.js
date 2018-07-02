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
        return Immutable.Set();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.GET_SCENE_RESPONSE:
                console.log("ciao ho ricevuto cose");
                return state;
            default:
                return state;
        }
    }
}

export default new LeftbarStore();
