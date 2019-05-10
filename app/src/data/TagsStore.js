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
        return Immutable.Map().set('default', Tag());
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_NEW_TAG:
                return state.set(action.uuid, action.tag);
            case ActionTypes.LOAD_ALL_SCENES:
                action.tags.forEach(tag => {
                    let t = Tag({
                        uuid: tag.uuid,
                        name: tag.name,
                        color: tag.color,
                    });
                    state = state.set(t.uuid, t);
                });
                return state;
            case ActionTypes.REMOVE_TAG:
                return state.delete(action.uuid);
            case ActionTypes.UPDATE_TAG:
                return state.set(action.tag.uuid, action.tag);
            case ActionTypes.RESET:
                return Immutable.Map().set('default', Tag());
            default:
                return state;
        }
    }
}

export default new TagsStore();
