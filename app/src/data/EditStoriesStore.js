import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';

class EditStoriesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return '';
    }

    reduce(state, action) {

        switch (action.type) {

			case ActionTypes.START_EDITING_STORY:
				return action.name;
			case ActionTypes.STOP_EDITING_STORY:
				return '';				
            default:
                return state;
        }
    }
}

export default new EditStoriesStore();