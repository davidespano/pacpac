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
                return state.set(action.uuid, action.tag);
            case ActionTypes.LOAD_ALL_SCENES:
                action.response.forEach(scene => {
                    let t = Tag({
                        uuid: scene.tag.uuid,
                        name: scene.tag.name,
                        color: scene.tag.color,
                    });
                    state = state.set(t.uuid, t);
                });
                return state;
            case ActionTypes.REMOVE_TAG:
                return state.delete(action.uuid);
            case ActionTypes.UPDATE_TAG:
                return state.set(action.tag.uuid, action.tag);
            default:
                return state;
        }
    }
}

export default new TagsStore();
