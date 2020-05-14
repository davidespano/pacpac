import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import EditorState from "./EditorState";
import Immutable from "immutable";
import SceneAPI from "../utils/SceneAPI";
import ScenesStore from "./ScenesStore";
import {createGlobalObjectForNewScene} from "../components/interface/Topbar";

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
                //non posso modificare più proprietà nella stessa set
                return state.set('rightbarSelection', 'objects').set('objectNameRightbar', action.obj.name);
            case ActionTypes.AUDIO_POSITIONING:
                return state.set('audioPositioning', action.status);
            case ActionTypes.COPY_RULE:
                return state.set('ruleCopy', action.rule);
            case ActionTypes.EDITOR_EXPANDED:
                return state.set('editorExpanded', action.status);
            case ActionTypes.EUD_SAVE_ORIGINAL_OBJECT:
                state = state.set('objectId', action.objectId);
                return state;
            case ActionTypes.EUD_SHOW_COMPLETIONS:
                state = state.set('actionId', action.actionId);
                state = state.set('role', action.role);
                state = state.set('completionInput', action.completionText);
                return state;
            case ActionTypes.IS_IT_NEW:
                return state.set('isItNew', action.bool);
            case ActionTypes.LEFTBAR_SELECTION:
                return state.set('leftbarSelection', action.selection);
            case ActionTypes.NEW_AUDIO_NAME_TYPED:
                return state.set('newAudioNameTyped', action.status);
            case ActionTypes.NEW_SCENE_NAME_TYPED:
                return state.set('newSceneNameTyped', action.status);
            case ActionTypes.DEBUG_SAVE:
                // Aggiornamento stato
                if(state.get('debugSaves') == null){ // Caso in cui EditorState.debugSaves sia null (la mappa non è ancora stata creata)
                    /* debugSaves è una mappa immutabile ordinata
                            <K, V> = <scene uuid, set di salvataggi relativi a quella scena>  */
                    state = state.set('debugSaves', new Immutable.OrderedMap()); // Creazione mappa
                }
                let saves = state.get('debugSaves'); // Recupero la mappa
                if(!saves.has(action.response.currentScene)){ // Caso in cui non ci sia un'entrata <K, V> dove K==action.response.currentScene
                    saves = saves.set(action.response.currentScene, new Immutable.Set()); // Creazione set
                }
                saves = saves.update(action.response.currentScene, set => set.add(action.response)); // Aggiungo il salvataggio corrente
                // Saves è ora la mappa state.debugSaves però con il salvataggio corrente aggiunto correttamente
                state = state.set('debugSaves', saves);
                return state;

            case ActionTypes.LOAD_DEBUG_SAVES:
                let debugSaves = action.saves;
                /*if(state.get('debugSaves') == null){ // Caso in cui EditorState.debugSaves sia null (la mappa non è ancora stata creata)
                    /* debugSaves è una mappa immutabile ordinata
                            <K, V> = <scene uuid, set di salvataggi relativi a quella scena>  */
                   /* state = state.set('debugSaves', new Immutable.OrderedMap()); // Creazione mappa
                }*/
                if(debugSaves){ // Se sono presenti salvataggi nel db
                    state = state.set('debugSaves', debugSaves); // Aggiornamento dello stato
                }
                console.log("EdiStateStore/debugSaves", state.get('debugSaves'));
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.set('rightbarSelection', 'scene');
                if(action.scene.uuid!='ghostScene'){
                    state = state.set('sceneOptions', action.scene);
                }
                //TODO: questo pezzo commentato potrebbe essere obsoleto e causare problemi
                /*
                console.log(action.scene.name);
                if (!state.get('homeScene') && action.scene.uuid != "ghostScene") { //if there is no homeScene selected, select the first one
                    state = state.set('homeScene', action.scene.uuid);
                    console.log("setting as homescene: ", action.scene.name);
                    SceneAPI.setHomeScene(action.scene.uuid, false);
                }
                */

                return state;
            case ActionTypes.RECEIVE_USER:
                return state.set('user', action.user);
            case ActionTypes.REMOVE_SCENE:
                return state.set('rightbarSelection', 'scene');
            case ActionTypes.REMOVE_OBJECT:
                return state.set('objectNameRightbar', null);
            case ActionTypes.RIGHTBAR_SELECTION:
                return state.set('rightbarSelection', action.selection);
            case ActionTypes.SET_INTERFACE_MODE:
                if (action.gameId) {
                    state = state.set('gameId', action.gameId);
                } else {
                    state = state.set('gameId', null);
                }
                return state.set('mode', action.mode);
            case ActionTypes.SELECT_FILE:
                return state.set('selectedFile', action.selection);
            case ActionTypes.SELECT_MEDIA_TO_EDIT:
                return state.set('selectedMediaToEdit', action.selection);
            case ActionTypes.SELECT_AUDIO_TO_EDIT:
                return state.set('audioToEdit', action.audio);
            case ActionTypes.SELECT_TAG_NEW_SCENE:
                return state.set('selectedTagNewScene', action.tag);
            case ActionTypes.SET_HOME_SCENE:
                return state.set('homeScene', action.scene);
            case ActionTypes.SET_GAME_TITLE:
                return state.set('gameTitle', action.title);
            case ActionTypes.SORT_SCENES:
                return state.set('scenesOrder', action.order);
            case ActionTypes.UPDATE_AUDIO_FILTER:
                return state.set('audioFilter', action.filter);
            case ActionTypes.UPDATE_DEBUG_SAVE_NAME_FILTER:
                return state.set('debugSavesFilter', action.filter);
            case ActionTypes.UPDATE_DEBUG_RUN_STATE:
                let debugRunState = state.get('debugRunState');
                if(!debugRunState){ // In caso il debugRunState sia vuoto, allora è da creare
                    debugRunState = {};
                }
                /* action.responseType ha due valori possibili:
                *   'runState' se action.response è un runState già costuito;
                *   'object' se action.respose è un oggetto js che rappresenta un oggetto da aggiungere o sovrascrivere alla runState già presente.
                *            In questo caso action.response contiene due campi:
                *               - action.response.uuid rappresenta l'identificatore dell'oggetto da aggiungere;
                *               - action.response.obj rappresenta le proprietà effettive dell'oggetto */
                let responseType = action.responseType;
                if(responseType === 'runState'){
                    debugRunState = {...debugRunState, ...action.response};
                } else {
                    debugRunState[action.response.uuid] = action.response.obj;
                }
                return state.set('debugRunState', debugRunState);
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return state.set('sceneOptions', action.scene);
            case ActionTypes.UPDATE_CURRENT_OBJECT:
                let name = action.obj ? action.obj.name : null;
                return state.set('objectNameRightbar', name);
            case ActionTypes.UPDATE_OBJECT_NAME_RIGHTBAR:
                return state.set('objectNameRightbar', action.name);
            case ActionTypes.UPDATE_OBJECTS_NAME_FILTER:
                return state.set('objectsNameFilter', action.filter);
            case ActionTypes.UPDATE_OTHER_SCENES_OBJECTS_NAME_FILTER:
                return state.set('otherScenesObjectsNameFilter', action.filter);
            case ActionTypes.UPDATE_OBJECTS_TYPE_FILTER:
                return state.set('objectsTypeFilter', action.filter);
            case ActionTypes.UPDATE_SCENE_NAME_FILTER:
                return state.set('scenesNameFilter', action.filter);
            case ActionTypes.UPDATE_SCENE_OPTIONS:
                return state.set('sceneOptions', action.scene);
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
