import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import StoryCollection from "./StoryCollection";

class StoryCollectionsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {

        switch (action.type) {
            case ActionTypes.LOAD_ALL_COLLECTIONS:	
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new Story object
                    action.response.forEach(function(collection){
                        let newCollection = StoryCollection({
                            name: collection.name,
							randomness: collection.randomness,
							images: [],
							stories: [],
                        });
                        state = state.set(newCollection.name, newCollection);
                    });
                }
                return state;		
			case ActionTypes.RECEIVE_COLLECTION:
				state = state.set(action.collection.name, action.collection);
				return state;
				
			case ActionTypes.UPDATE_COLLECTION:
				state = state.set(action.collection.name, action.collection);
				return state;	
				
			case ActionTypes.REMOVE_STORY:
				let stories = action.collection.get('stories');
				let st = stories.filter((uuid) => uuid !== action.story.get('uuid'));
				let newCollection = action.collection.setIn(['stories'], st );
				state = state.set(newCollection.name, newCollection);
				return state;
			
			case ActionTypes.REMOVE_COLLECTION:		
				state = state.delete(action.collection.name);		
				return state;			

	
            default:
                return state;
        }
    }
}

export default new StoryCollectionsStore();