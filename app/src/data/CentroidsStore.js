import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import stores_utils from "./stores_utils";
import interface_utils from "../components/interface/interface_utils";

class CentroidsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.REMOVE_OBJECT:
                if(state.has(action.obj.uuid)){
                    state = state.delete(action.obj.uuid);
                }
                return state;
            case ActionTypes.RECEIVE_OBJECT:
                if(action.obj.vertices != null){
                    state = state.set(action.obj.uuid, interface_utils.centroid(action.obj.vertices));
                }
                return state;
            case ActionTypes.UPDATE_VERTICES:
                state = state.set(action.obj.uuid, interface_utils.centroid(action.vertices));
                return state;
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state;
        }
    }
}

export default new CentroidsStore();