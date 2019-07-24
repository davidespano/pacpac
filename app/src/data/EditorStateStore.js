import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import EditorState from "./EditorState";
import Immutable from "immutable";

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
                return state.set('rightbarSelection', 'objects').set('objectNameRightbar', action.obj.name);
            case ActionTypes.AUDIO_SPATIAL_OPTION:
                return state.set('isAudioSpatial', action.status);
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
            case ActionTypes.LEFTBAR_SELECTION:
                return state.set('leftbarSelection', action.selection);
            case ActionTypes.LOGIN_MODE_ON:
                return state.set('mode', ActionTypes.LOGIN_MODE_ON);
            case ActionTypes.LOOP_CHECK:
                return state.set('loopChecked', action.check);
            case ActionTypes.NEW_AUDIO_NAME_TYPED:
                return state.set('newAudioNameTyped', action.status);
            case ActionTypes.NEW_SCENE_NAME_TYPED:
                return state.set('newSceneNameTyped', action.status);
            case ActionTypes.FILE_MANAGER_MODE_ON:
                return state.set('mode', ActionTypes.FILE_MANAGER_MODE_ON);
            case ActionTypes.PLAY_MODE_ON:
                return state.set('mode', ActionTypes.PLAY_MODE_ON);
            case ActionTypes.DEBUG_MODE_ON:
                return state.set('mode', ActionTypes.DEBUG_MODE_ON);
            case ActionTypes.DEBUG_SAVES:
                let oldSaves = null;
                let newSaves = null;
                let c = 0; //counter

                action.response.body.forEach(el => {
                        oldSaves = EditorState.debugSaves[el.currentScene];

                        if(oldSaves !== null) {
                            newSaves = new Immutable.Set(oldSaves).add(el.saveName);

                            //state = state.set(el.currentScene, newSaves)
                            EditorState.debugSaves[el.currentScene] = newSaves;
                        }
                        console.log(c++);
                    }
                );
                return state.set('debugSaves', action.response);
            case ActionTypes.RECEIVE_SCENE:
                state = state.set('rightbarSelection', 'scene');
                state = state.set('selectedSceneSpatialAudio', action.scene.uuid);
                state = state.set('sceneNameRightbar', action.scene.name);
                return state;
            case ActionTypes.RECEIVE_USER:
                return state.set('user', action.user);
            case ActionTypes.REMOVE_SCENE:
                return state.set('rightbarSelection', 'scene').set('selectedSceneSpatialAudio', null);
            case ActionTypes.REMOVE_OBJECT:
                return state.set('objectNameRightbar', null);
            case ActionTypes.RIGHTBAR_SELECTION:
                return state.set('rightbarSelection', action.selection);
			case ActionTypes.STORY_EDITOR_MODE_ON:
                return state.set('mode', ActionTypes.STORY_EDITOR_MODE_ON);
            case ActionTypes.SELECT_AUDIO_FILE:
                return state.set('selectedAudioFile', action.selection);
            case ActionTypes.SELECT_FILE:
                return state.set('selectedFile', action.selection);
            case ActionTypes.SELECT_MEDIA_TO_EDIT:
                return state.set('selectedMediaToEdit', action.selection);
            case ActionTypes.SELECT_AUDIO_TO_EDIT:
                state = state.set('selectedAudioToEdit', action.selection);
                state = state.set('isAudioSpatial', action.isSpatial);
                state = state.set('selectedAudioFile', action.file);
                state = state.set('loopChecked', action.check);
                state = action.scene ? state.set('selectedSceneSpatialAudio', action.scene) : state;
                return state;
            case ActionTypes.SELECT_SCENE_SPATIAL_AUDIO:
                return state.set('selectedSceneSpatialAudio', action.selection);
            case ActionTypes.SELECT_TAG_NEW_SCENE:
                return state.set('selectedTagNewScene', action.tag);
            case ActionTypes.SORT_SCENES:
                return state.set('scenesOrder', action.order);
            case ActionTypes.SET_MENTION_TYPE:
                return state.set('mentionType', action.mentionType);
            case ActionTypes.UPDATE_AUDIO_FILTER:
                return state.set('audioFilter', action.filter);
            case ActionTypes.UPDATE_CURRENT_SCENE:
                console.log('UPDATE')
                console.log(action.scene);
                return state.set('selectedSceneSpatialAudio', action.scene.uuid).set('sceneNameRightbar', action.scene.name);
            case ActionTypes.UPDATE_CURRENT_OBJECT:
                let o = action.obj ? action.obj.name : null;
                return state.set('objectNameRightbar');
            case ActionTypes.UPDATE_OBJECT_NAME_RIGHTBAR:
                console.log(action.name);
                return state.set('objectNameRightbar', action.name);
            case ActionTypes.UPDATE_OBJECTS_NAME_FILTER:
                return state.set('objectsNameFilter', action.filter);
            case ActionTypes.UPDATE_OBJECTS_TYPE_FILTER:
                return state.set('objectsTypeFilter', action.filter);
            case ActionTypes.UPDATE_SCENE_NAME_FILTER:
                return state.set('scenesNameFilter', action.filter);
            case ActionTypes.UPDATE_SCENE_NAME_RIGHTBAR:
                return state.set('sceneNameRightbar', action.name);
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
