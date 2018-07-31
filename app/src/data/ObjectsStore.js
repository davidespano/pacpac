import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';


class ObjectsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_TRANSITION:
                //console.log(action.obj)
                state = state.set(action.obj.uuid, action.obj);
                return state;
            default:
                return state;
        }
    }
}

export default new ObjectsStore();