import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Story from "./Story";

class StoriesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {

        switch (action.type) {

            case ActionTypes.LOAD_ALL_STORIES:
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new Story object
                    action.response.forEach(function(story){
                        let newStory = Story({
                            name : story.name.replace(/\.[^/.]+$/, ""),
                            img : story.name,
							relevance: story.relevance,
							randomness: story.randomness,
							systemStory: story.systemStory,
							userStory: story.userStory,
							lastUpdate: story.lastUpdate,
                        });
                        state = state.set(newStory.name, newStory);
                    });
                }
                return state;			
			case ActionTypes.RECEIVE_STORY:
				state = state.set(action.story.name, action.story)
				return state;
			case ActionTypes.REMOVE_STORY:
				state = state.delete(action.story.name);
				return state;			
			case ActionTypes.UPDATE_STORY:
				state = state.set(action.story.name, action.story);
				return state;	
			case ActionTypes.EDIT_STORY:
				return state.setIn([action.name, 'userStory'], action.userStory);							
            default:
                return state;
        }
    }
}

export default new StoriesStore();