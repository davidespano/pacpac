import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import FormImage from "./FormImage";

class FormImagesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap().set(0, FormImage());
    }

    reduce(state, action) {

        switch (action.type) {
			
			case ActionTypes.ADD_FORM_IMAGE:
				return state.set(action.index, action.image);
			
			case ActionTypes.RECEIVE_FORM_IMAGE:
				state = state.set(action.index, action.image);
				return state;		
			
			case ActionTypes.UPDATE_FORM_IMAGE:
				state = state.set(action.image.index, action.image);
				return state;	
			
			case ActionTypes.UPDATE_FORM_IMAGE_NAME:
				return state.setIn([action.index, 'name'], action.name);		
			
			case ActionTypes.REMOVE_FORM_IMAGE:
				return state.delete(action.index);
			
			case ActionTypes.RESET_FORM_IMAGE:
				return Immutable.OrderedMap().set(0, FormImage());			
			
            default:
                return state;
        }
    }
}

export default new FormImagesStore();