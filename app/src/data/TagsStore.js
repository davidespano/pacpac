import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Tag from "../scene/Tag";
import SceneAPI from "../utils/SceneAPI";



class TagsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        SceneAPI.saveTag(Tag());
        return Immutable.Map().set('default', Tag());
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_NEW_TAG:
                return state.set(action.tag.uuid, action.tag);
            case ActionTypes.LOAD_ALL_TAGS:
                return state;
            default:
                return state;
        }
    }
}

export default new TagsStore();
