import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';

class CurrentObjectStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return {
            object: null,
            type: null,
        };
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_TRANSITION:
                return {
                    object: action.obj,
                    type: InteractiveObjectsTypes.TRANSITION,
                };
            case ActionTypes.SELECT_ALL_OBJECTS:
                return {
                    object: null,
                    type: null,
                };
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return {
                    object: null,
                    type: null,
                };
            default:
                return state;
        }
    }
}

export default new CurrentObjectStore();