import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';

class StoryImagesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {

        switch (action.type) {
			
			case ActionTypes.RECEIVE_IMAGE:
				state = state.set(action.image.uuid, action.image);
				return state;		
			
			case ActionTypes.UPDATE_IMAGE:
				state = state.set(action.image.uuid, action.image);
				return state;	
			
			case ActionTypes.REMOVE_COLLECTION:
			    let images = action.collection.get('images').flat();
				images.forEach( img => state = state.delete(img));
				return state;	
			
            default:
                return state;
        }
    }
}

export default new StoryImagesStore();