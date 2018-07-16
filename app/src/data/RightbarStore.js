import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';

class RightbarStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return {
            currentObject: null,
            currentType: null,
        };
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_TRANSITION:
                return {
                    currentObject: action.obj,
                    currentType: InteractiveObjectsTypes.TRANSITION,
                };

            default:
                return state;
        }
    }
}

export default new RightbarStore();