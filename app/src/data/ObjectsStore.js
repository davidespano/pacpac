import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class ObjectsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return new Set();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                state.add(action.obj);
                return state;
            default:
                return state;
        }
    }
}

export default new ObjectsStore();