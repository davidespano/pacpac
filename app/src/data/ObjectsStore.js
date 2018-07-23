import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import InteractiveObject from "../interactives/InteractiveObject";
import Transition from "../interactives/Transition";


class ObjectsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Set();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_TRANSITION:
                //console.log(action.obj)
                return state.add(action.obj);
            default:
                return state;
        }
    }
}

export default new ObjectsStore();