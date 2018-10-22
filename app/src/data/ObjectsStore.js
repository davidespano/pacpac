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
            case ActionTypes.ADD_NEW_OBJECT:
                console.log(state);
                state = state.set(action.obj.uuid, action.obj).sort(comparator);
                console.log(state);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                state = state.delete(action.obj.uuid);
                return state;
            case ActionTypes.ADD_NEW_TRANSITION:
                //console.log(action.obj)
                state = state.set(action.obj.uuid, action.obj).sort();
                return state;
            case ActionTypes.REMOVE_TRANSITION:
                state = state.delete(action.obj.uuid);
                return state;
            default:
                return state;
        }
    }
}

export default new ObjectsStore();


function comparator(a, b){
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
}