import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';
import SceneAPI from '../utils/SceneAPI';
import ObjectToSceneStore from "../data/ObjectToSceneStore";
import ScenesStore from "../data/ScenesStore";
import CentralSceneStore from "../data/CentralSceneStore";
import InteractiveObjectAPI from "../utils/InteractiveObjectAPI";
import AudioAPI from "../utils/AudioAPI";

const Actions = {

    /**
     * reset game data
     */
    reset(){
        AppDispatcher.dispatch({
            type: ActionTypes.RESET,
        })
    },

    //EDITOR

    /**
     * This functions handle editor state variables (such as current mode and selected menus)
     **/


    editModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.EDIT_MODE_ON
        })
    },

    gameSelectionModeOn(){
        AppDispatcher.dispatch({
            type: ActionTypes.GAME_SELECTION_MODE_ON,
        })
    },

    geometryModeOn(){
        AppDispatcher.dispatch({
            type: ActionTypes.GEOMETRY_MODE_ON
        })
    },

    playModeOn(){
        AppDispatcher.dispatch({
            type: ActionTypes.PLAY_MODE_ON
        })
    },

    loginModeOn(){
        AppDispatcher.dispatch({
            type: ActionTypes.LOGIN_MODE_ON
        })
    },

    rightbarSelection(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.RIGHTBAR_SELECTION,
            selection: selection,
        })
    },

    dropdownScenesOrder(status){
        AppDispatcher.dispatch({
            type: ActionTypes.DROPDOWN_SCENES_ORDER,
            status: status,
        })
    },

    dropdownTagsNewScene(status){
        AppDispatcher.dispatch({
            type: ActionTypes.DROPDOWN_TAGS_NEW_SCENE,
            status: status,
        })
    },

    dropdownTagsRightbar(status){
        AppDispatcher.dispatch({
            type: ActionTypes.DROPDOWN_TAGS_RIGHTBAR,
            status: status,
        })

    },


    selectAudioFile(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_AUDIO_FILE,
            selection: selection,
        })
    },


    selectFile(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_FILE,
            selection: selection,
        })
    },

    selectMediaToEdit(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_MEDIA_TO_EDIT,
            selection: selection,
        })
    },

    selectAudioToEdit(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_AUDIO_TO_EDIT,
            selection: selection,
        })
    },

    selectSceneSpatialAudio(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_SCENE_SPATIAL_AUDIO,
            selection: selection,
        })
    },

    selectTagNewScene(tag){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_TAG_NEW_SCENE,
            tag: tag,
        })
    },

    fileManagerModeOn(){
       AppDispatcher.dispatch({
            type: ActionTypes.FILE_MANAGER_MODE_ON
       })
    },

    newAudioNameTyped(status){
        AppDispatcher.dispatch({
            type: ActionTypes.NEW_AUDIO_NAME_TYPED,
            status: status,
        })
    },

    newSceneNameTyped(status){
        AppDispatcher.dispatch({
            type: ActionTypes.NEW_SCENE_NAME_TYPED,
            status: status,
        })
    },

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    updateAudioFilter(filter){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_AUDIO_FILTER,
            filter: filter,
        })
    },

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    updateObjectTypeFilter(filterType){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECTS_TYPE_FILTER,
            filter: filterType,
        })
    },

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    updateObjectNameFilter(filterType){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECTS_NAME_FILTER,
            filter: filterType,
        })
    },

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    updateSceneNameFilter(filterType){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_NAME_FILTER,
            filter: filterType,
        })
    },

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    updateTagFilter(filter){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_TAG_FILTER,
            filter: filter,
        })
    },

    changeAudioFormStatus(status){
        AppDispatcher.dispatch({
            type: ActionTypes.AUDIO_FORM_STATUS,
            status: status,
        })
    },

    changeAudioSpatialOptionStatus(status){
        AppDispatcher.dispatch({
            type: ActionTypes.AUDIO_SPATIAL_OPTION,
            status: status,
        })
    },

    //SCENES

    /**
     * Updates store with coordinates of last point clicked (over central scene)
     * @param x
     * @param y
     */
    clickScene(x, y) {
        AppDispatcher.dispatch({
            type: ActionTypes.CLICK_SCENE,
            x: x,
            y: y,
        })
    },

    /**
     * Retrieves scenes' basic data from db and sends it to the stores, then calls asynchronous update for each scene in
     * order to get complete data
     * @param response
     * @param order of scenes
     */
    loadAllScenes(response, order = null){
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_SCENES,
            scenes: response.scenes,
            order: order,
            tags: response.tags,
        });
        response.scenes.forEach(scene => {
            SceneAPI.getByName(scene.name, order);
        })

    },

    /**
     * Dispatch to the stores the Scene received from db
     * @param scene
     * @param order of scenes
     */
    receiveScene(scene, order){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_SCENE,
            scene: scene,
            order: order,
            objectsToScene: ObjectToSceneStore.getState(),
        });
    },

    /**
     * Dispatch current scene update
     * @param uuid of the scene
     */
    updateCurrentScene(uuid){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_SCENE,
            uuid: uuid,
            objectsToScene: ObjectToSceneStore.getState(),
            scene: ScenesStore.getState().get(uuid),
        });
    },

    /**
     * Dispatch generic scene update
     * @param scene
     */
    updateScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE,
            scene: scene,
        });
        SceneAPI.updateScene(scene.uuid, scene.name, scene.img, scene.type, scene.tag);
    },

    /**
     * Dispatch scene name update (since the name is the scene key in ScenesStore map, it needs a specific update)
     * @param scene
     * @param oldName
     * @param order of scenes
     */
    updateSceneName(scene, oldName, order){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_NAME,
            scene: scene,
            oldName: oldName,
            order: order,
        });
        SceneAPI.updateScene(scene.uuid, scene.name, scene.img, scene.type, scene.tag);
    },

    /**
     * Dispatch generic scene removal
     * @param scene
     */
    removeScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_SCENE,
            scene: scene,
        });
        SceneAPI.deleteScene(scene);
    },

    /**
     * Dispatch all scenes removal
     */
    removeAllScenes(){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_ALL_SCENES,
        })
    },

    /**
     * Sort scenes according to the given order
     * @param order
     */
    sortScenes(order){
        AppDispatcher.dispatch({
            type: ActionTypes.SORT_SCENES,
            order: order,
        })
    },

    //TAGS

    /**
     * Dispatch creation of new tag
     * @param tag
     */
    addNewTag(tag){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_TAG,
            uuid: tag.uuid,
            tag: tag,
        });
        SceneAPI.saveTag(tag);
    },

    /**
     * Dispatch tag removal
     * @param tag_uuid
     */
    removeTag(tag_uuid){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_TAG,
            uuid: tag_uuid,
        })
    },

    /**
     * Dispatch tag update
     * @param tag
     */
    updateTag(tag){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_TAG,
            tag: tag,
        });
        SceneAPI.saveTag(tag);
    },


    //INTERACTIVE OBJECTS

    /**
     * Adds new object (also handles stores, scenes and db update)
     * @param scene
     * @param object
     */
    addNewObject(scene, object){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_OBJECT,
            scene: scene,
            obj: object,
        });
        InteractiveObjectAPI.saveObject(scene, object);
    },

    /**
     * Handles an object received from db
     * @param object
     */
    receiveObject(object){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_OBJECT,
            obj: object,
        })
    },

    /**
     * Dispatch object removal
     * @param scene
     * @param object
     */
    removeObject(scene, object){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_OBJECT,
            scene: scene,
            obj: object,
        })
    },

    /**
     * Dispatch all object selection (rightbar)
     */
    selectAllObjects(){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_ALL_OBJECTS,
        })
    },

    /**
     * Dispatch current object update (rightbar)
     * @param uuid
     */
    updateCurrentObject(uuid){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_OBJECT,
            uuid: uuid,
        })
    },

    /**
     * Dispatch update of any object to the objects store
     * @param object
     */
    updateObject(object){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECT,
            obj: object,
        })
    },

    /**
     * Dispatch update of any object to the objects store
     * @param object
     */
    editVertices(object){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_VERTICES,
            obj: object,
            vertices: object.get('vertices'),
        })
    },


    //RULES

    /**
     * Dispatch new Rule (stores also handle scene update)
     * @param scene
     * @param rule
     */
    addNewRule(scene, rule){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_RULE,
            scene: scene,
            rule: rule,
        });
        InteractiveObjectAPI.saveRule(scene, rule);
    },

    /**
     * Handles a Rule received from db
     * @param rule
     */
    receiveRule(rule){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_RULE,
            rule: rule,
        })
    },

    /**
     * Dispatch rule removal (stores also handle scene update)
     * @param scene
     * @param rule
     */
    removeRule(scene, rule){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_RULE,
            scene: scene,
            rule: rule,
        })
        InteractiveObjectAPI.removeRule(scene, rule);
    },


    setMentionType(mentionType){
        AppDispatcher.dispatch({
            type: ActionTypes.SET_MENTION_TYPE,
            mentionType: mentionType,
        })
    },

    /**
     * Dispatch update of any rule
     * @param rule
     */
    updateRule(rule){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE,
            rule: rule,
        });
        let scene = ScenesStore.getState().get(CentralSceneStore.getState());
        InteractiveObjectAPI.saveRule(scene, rule);
    },


    updateRuleEditorFromState(state){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE_EDITOR_STATE,
            state: state,
        })
    },

    updateRuleEditorFromContent(content, selection){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE_EDITOR_CONTENT,
            content: content,
            selection: selection,
        })
    },

    updateRuleEditorFromRaw(raw){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE_EDITOR_RAW,
            raw: raw,
        })
    },

    updateSuggestion(state){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SUGGESTION,
            state: state,
        })
    },

    // [davide] eud editor state
    eudShowCompletions(actionId, role, input){
        AppDispatcher.dispatch({
            type: ActionTypes.EUD_SHOW_COMPLETIONS,
            actionId: actionId,
            role: role,
            completionText: input,
        })
    },

    eudSaveOriginalObject(objectId){
        AppDispatcher.dispatch({
            type: ActionTypes.EUD_SAVE_ORIGINAL_OBJECT,
            objectId: objectId,
        })
    },

    //AUDIO

    /**
     * Add new audio to stores and scene, dispatch db update
     * @param audio
     */
    addNewAudio(audio){
        if(audio.isSpatial){
            AppDispatcher.dispatch({
                type: ActionTypes.ADD_NEW_SPATIAL_AUDIO,
                scene: ScenesStore.getState().get(audio.scene),
                audio: audio,
            })
            AudioAPI.createUpdateLocalAudio(audio.scene);
        } else {
            AppDispatcher.dispatch({
                type: ActionTypes.ADD_NEW_GLOBAL_AUDIO,
                audio: audio,
            })
            AudioAPI.createUpdateGlobalAudio(audio);
        }

    },

    /**
     * Remove audio from stores and scene, dispatch db update
     * @param audio
     */
    removeAudio(audio){
        if(audio.isSpatial){
            AppDispatcher.dispatch({
                type: ActionTypes.REMOVE_SPATIAL_AUDIO,
                scene: ScenesStore.getState().get(audio.scene),
                audio: audio,
            })
        } else {
            AppDispatcher.dispatch({
                type: ActionTypes.REMOVE_GLOBAL_AUDIO,
                audio: audio,
            })
        }
        /**TODO: Dispatch db update here**/
    },


    /**
     * Updates audio in stores, dispatch db update
     * @param audio
     */
    updateAudio(audio){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_AUDIO,
            audio: audio,
        });

        if(audio.isSpatial)
            AudioAPI.createUpdateLocalAudio(audio.scene);
        else
            AudioAPI.createUpdateGlobalAudio(audio);
    },

    //MEDIA

    loadAllAssets(list){
      AppDispatcher.dispatch({
          type: ActionTypes.LOAD_ALL_ASSETS,
          list: list,
      })
    },

    //OTHER

    onDrop(picture){
        AppDispatcher.dispatch({
            type: ActionTypes.ON_PICTURE_DROP,
            picture,
        })
    },

    receiveUser(user){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: user,
        })
    },

    updateDatalist(id,value){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_DATALIST,
            id: id,
            value: value,
        })
    },


};

export default Actions;