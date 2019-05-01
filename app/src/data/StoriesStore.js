import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';

class StoriesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {

        switch (action.type) {

			case ActionTypes.RECEIVE_STORY:
				state = state.set(action.story.uuid, action.story);
				return state;
			
			case ActionTypes.REMOVE_STORY:
				state = state.delete(action.story.uuid);
				return state;			
			
			case ActionTypes.UPDATE_STORY:
				state = state.set(action.story.uuid, action.story);
				return state;	
			
			case ActionTypes.EDIT_STORY:
				return state.setIn([action.uuid, 'userStory'], action.userStory);
			
			case ActionTypes.REMOVE_COLLECTION:
			    let stories = action.collection.get('stories').flat();
				stories.forEach( st => state = state.delete(st));
				return state;
			
            default:
                return state;
        }
    }
}

export default new StoriesStore();