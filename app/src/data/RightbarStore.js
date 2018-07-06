import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class RightbarStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return {
            currentObject: null,
        };
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                return {
                    currentObject: action.obj,
                };
            default:
                return state;
        }
    }
}

export default new RightbarStore();