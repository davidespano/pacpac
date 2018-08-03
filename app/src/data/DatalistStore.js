import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';


class DatalistStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.UPDATE_DATALIST:
                //console.log(action.obj)
                state = state.set(action.id, action.value);
                return state;
            default:
                return state;
        }
    }
}

export default new DatalistStore()