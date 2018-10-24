import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';

class CurrentObjectStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return null;
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                return action.obj;
            case ActionTypes.SELECT_ALL_OBJECTS:
                return null;
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return null;
            case ActionTypes.UPDATE_CURRENT_OBJECT:
                return action.obj;
            default:
                return state;
        }
    }
}

export default new CurrentObjectStore();