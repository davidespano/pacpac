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
            case ActionTypes.UPDATE_VERTICES:
                /*
                let centroid = interface_utils.centroid(action.vertices);
                state = state.set(action.obj.uuid, centroid);
                */
                return state;
            default:
                return state;
        }
    }
}

export default new CentroidsStore();