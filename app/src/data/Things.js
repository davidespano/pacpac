import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class ThingsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return [];
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.UPDATE_THINGS:
                return action.things;
            default:
                return state;
        }
    }
}

export default new ThingsStore();
