import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';


class TagsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return [{
            tagName: '---',
            tagColor: 'black',
        }];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_NEW_TAG:
                state.push({
                    tagName: action.name,
                    tagColor: action.color,
                });
                return state;
            case ActionTypes.LOAD_ALL_TAGS:
                return state;
            default:
                return state;
        }
    }
}

export default new TagsStore();
