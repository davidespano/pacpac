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
        return Immutable.OrderedMap();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_SCENE:
                console.log("CIAO PASSO DA QUI");
                console.log(action);
                return state.set(
                    action.id,
                    new LeftbarElement({
                        id: action.id,
                        name: action.name,
                        img: action.img})
                );
            default:
                return state;
        }
    }
}

export default new LeftbarStore();
