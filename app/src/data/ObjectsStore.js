import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import stores_utils from "./stores_utils";


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
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.crescent_comparator);
                return state;
            case ActionTypes.RECEIVE_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.crescent_comparator);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                state = state.delete(action.obj.uuid);
                return state;
            case ActionTypes.UPDATE_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.crescent_comparator);
                return state;
            case ActionTypes.REMOVE_SCENE:

                let objects = action.scene.get('objects');
                objects.transitions.forEach(obj_uuid => {
                    state = state.delete(obj_uuid);
                });
                objects.switches.forEach(obj_uuid => {
                    state = state.delete(obj_uuid);
                });

                return state;
            default:
                return state;
        }
    }
}

export default new ObjectsStore();