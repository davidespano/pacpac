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
            case ActionTypes.AUDIO_LOCAL_OPTION:
                return state.set('isAudioLocal', action.status);
            case ActionTypes.AUDIO_FORM_STATUS:
                return state.set('isEditAudioOn', action.status);
            case ActionTypes.DROPDOWN_TAGS_NEW_SCENE:
                return state.set('chooseTagNewScene', action.status);
            case ActionTypes.DROPDOWN_TAGS_RIGHTBAR:
                return state.set('chooseTagRightbar', action.status);
            case ActionTypes.EDIT_MODE_ON:
                return state.set('mode', ActionTypes.EDIT_MODE_ON);
            case ActionTypes.EUD_SAVE_ORIGINAL_OBJECT:
                state = state.set('objectId', action.objectId);
                return state;
            case ActionTypes.EUD_SHOW_COMPLETIONS:
                state = state.set('actionId', action.actionId);
                state = state.set('role', action.role);
                state = state.set('completionInput', action.completionText);
                return state;
            case ActionTypes.GAME_SELECTION_MODE_ON:
                return state.set('mode', ActionTypes.GAME_SELECTION_MODE_ON);
            case ActionTypes.GEOMETRY_MODE_ON:
                return state.set('mode', ActionTypes.GEOMETRY_MODE_ON);
            case ActionTypes.LOGIN_MODE_ON:
                return state.set('mode', ActionTypes.LOGIN_MODE_ON);
            case ActionTypes.NEW_SCENE_NAME_TYPED:
                return state.set('newSceneNameTyped', action.status);
            case ActionTypes.FILE_MANAGER_MODE_ON:
                return state.set('mode', ActionTypes.FILE_MANAGER_MODE_ON);
            case ActionTypes.PLAY_MODE_ON:
                return state.set('mode', ActionTypes.PLAY_MODE_ON);
            case ActionTypes.RECEIVE_SCENE:
                return state.set('rightbarSelection', 'scene');
            case ActionTypes.RECEIVE_USER:
                return state.set('user', action.user);
            case ActionTypes.REMOVE_SCENE:
                return state.set('rightbarSelection', 'scene');
            case ActionTypes.RIGHTBAR_SELECTION:
                return state.set('rightbarSelection', action.selection);
            case ActionTypes.SELECT_FILE:
                return state.set('selectedFile', action.selection);
            case ActionTypes.SELECT_MEDIA_TO_EDIT:
                return state.set('selectedMediaToEdit', action.selection);
            case ActionTypes.SELECT_AUDIO_TO_EDIT:
                return state.set('selectedAudioToEdit', action.selection);
            case ActionTypes.SELECT_TAG_NEW_SCENE:
                return state.set('selectedTagNewScene', action.tag);
            case ActionTypes.SORT_SCENES:
                return state.set('scenesOrder', action.order);
            case ActionTypes.SET_MENTION_TYPE:
                //console.log('update mention type to ' + action.mentionType)
                return state.set('mentionType', action.mentionType);
            case ActionTypes.UPDATE_AUDIO_FILTER:
                return state.set('audioFilter', action.filter);
            case ActionTypes.UPDATE_OBJECTS_NAME_FILTER:
                return state.set('objectsNameFilter', action.filter);
            case ActionTypes.UPDATE_OBJECTS_TYPE_FILTER:
                return state.set('objectsTypeFilter', action.filter);
            case ActionTypes.UPDATE_SCENE_NAME_FILTER:
                return state.set('scenesNameFilter', action.filter);
            case ActionTypes.UPDATE_TAG_FILTER:
                return state.set('tagFilter', action.filter);
            case ActionTypes.RESET:
                return EditorState();
            default:
                return state;
        }
    }
}

export default new EditorStateStore();
