import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import EditorState from "./EditorState";

class EditorStateStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return EditorState();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_NEW_OBJECT:
                return state.set('rightbarSelection', 'objects');
            case ActionTypes.DROPDOWN_SCENES_ORDER:
                return state.set('scenesOrderMenu', action.status);
            case ActionTypes.DROPDOWN_TAGS_NEW_SCENE:
                return state.set('chooseTagNewScene', action.status);
            case ActionTypes.DROPDOWN_TAGS_RIGHTBAR:
                return state.set('chooseTagRightbar', action.status);
            case ActionTypes.EDIT_MODE_ON:
                return state.set('mode', ActionTypes.EDIT_MODE_ON);
            case ActionTypes.GEOMETRY_MODE_ON:
                return state.set('mode', ActionTypes.GEOMETRY_MODE_ON);
            case ActionTypes.FILE_MANAGER_MODE_ON:
                return state.set('mode', ActionTypes.FILE_MANAGER_MODE_ON);
            case ActionTypes.OBJECTS_FILTER:
                return state.set('objectsFilter', action.filter);
            case ActionTypes.PLAY_MODE_ON:
                return state.set('mode', ActionTypes.PLAY_MODE_ON);
            case ActionTypes.RECEIVE_SCENE:
                return state.set('rightbarSelection', 'scene');
            case ActionTypes.REMOVE_SCENE:
                return state.set('rightbarSelection', 'scene');
            case ActionTypes.RIGHTBAR_SELECTION:
                return state.set('rightbarSelection', action.selection);
            case ActionTypes.SELECT_TAG_NEW_SCENE:
                return state.set('selectedTagNewScene', action.tag);
            case ActionTypes.SORT_SCENES:
                return state.set('scenesOrder', action.order);
            default:
                return state;
        }
    }
}

export default new EditorStateStore();
