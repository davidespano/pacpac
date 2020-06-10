import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';
import SceneAPI from '../utils/SceneAPI';
import ObjectToSceneStore from "../data/ObjectToSceneStore";
import ScenesStore from "../data/ScenesStore";
import CentralSceneStore from "../data/CentralSceneStore";
import InteractiveObjectAPI from "../utils/InteractiveObjectAPI";
import AudioAPI from "../utils/AudioAPI";
import StoryAPI from '../utils/StoryAPI';
import Values from "../rules/Values";
import ObjectsStore from "../data/ObjectsStore";
import EditorStateStore from "../data/EditorStateStore";

/**[Vittoria]
 * In questo file troviamo le azioni, esse possono essere richiamate tramite props.nomefunzione
 * Quando viene chiamata un'azione essa deve finire di essere eseguita prima di poterne richiamare un'altra, quindi
 * c'è una gestione a collo di bottiglia,
 * es: props.azione1;
 *     props.azione2; -> Questa verrà sempre gestita dopo, quindi conviene evitare questo comportamento perchè sono due
 *                      render diverse e ci sarà un aggiornamento. La cosa migliore è mettere un'azione per volta oppure
 * se voglio gestire più azioni di seguito conviene accorparle
 * Prendono un type (costante che ritroviamo su ActionType.js) ed eventuali altri campi
 */
const Actions = {

    /**
     * reset game data, it's triggered when the user exits from a game
     */
    reset() {
        AppDispatcher.dispatch({
            type: ActionTypes.RESET,
        })
    },

    //EDITOR

    /**
     * This functions set interfaces mode, that is, what the interface should show
     **/
    editModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.EDIT_MODE_ON,
        })
    },

    gameSelectionModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.GAME_SELECTION_MODE_ON,
        })
    },

    geometryModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.GEOMETRY_MODE_ON
        })
    },

    playModeOn(gameId = null) {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.PLAY_MODE_ON,
            gameId: gameId,
        })
    },

    debugModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.DEBUG_MODE_ON
        })
    },

    loginModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.LOGIN_MODE_ON,
        })
    },

    storyEditorModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.STORY_EDITOR_MODE_ON,
        })
    },

    fileManagerModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_INTERFACE_MODE,
            mode: ActionTypes.FILE_MANAGER_MODE_ON
        })
    },

    audioPositioning(status) {
        AppDispatcher.dispatch({
            type: ActionTypes.AUDIO_POSITIONING,
            status: status,
        })
    },


    debugSaves(response) {
        AppDispatcher.dispatch({
            type: ActionTypes.DEBUG_SAVES,
            response: response,
        })
    },

    /**
     * select tab in leftbar
     * @param selection 'scenes' or 'saves'
     */
    leftbarSelection(selection) {
        AppDispatcher.dispatch({
            type: ActionTypes.LEFTBAR_SELECTION,
            selection: selection,
        })
    },

    /**
     * select tab in rightbar
     * @param selection 'scene' or 'objects'
     */
    rightbarSelection(selection) {
        AppDispatcher.dispatch({
            type: ActionTypes.RIGHTBAR_SELECTION,
            selection: selection,
        })
    },

    /**
     * Triggered when expanding/reducing rules editor
     * @param status true if expanding, false if reducing
     */
    expandEditor(status) {
        AppDispatcher.dispatch({
            type: ActionTypes.EDITOR_EXPANDED,
            status: status,
        })
    },

    /**
     * updates a variable with the file selected
     * @param selection is the file name (path included)
     */
    selectFile(selection) {
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_FILE,
            selection: selection,
        })
    },

    /**
     * Updates the EditorStateStore with a string that indicates from which component the user is selecting a file
     * @param selection could be 'audio-form', 'rightbar', etc
     */
    selectMediaToEdit(selection) {
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_MEDIA_TO_EDIT,
            selection: selection,
        })
    },

    /**
     * Saves intermediate data when creating/editing an Audio object
     * @param audio new Audio object or copy of an existing one
     */
    selectAudioToEdit(audio) {
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_AUDIO_TO_EDIT,
            audio: audio,
        })
    },

    /**
     * save the tag chosen when creating a new Scene
     * @param tag
     */
    selectTagNewScene(tag) {
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_TAG_NEW_SCENE,
            tag: tag,
        })
    },

    /**
     * stores the id of the game's starting scene
     * @param sceneId
     */
    setHomeScene(sceneId) {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_HOME_SCENE,
            scene: sceneId,
        })
    },

    /**
     * stores the game title
     * @param title
     */
    setGameTitle(title) {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_GAME_TITLE,
            title: title,
        })
    },

    /**
     * updates the editor with a boolean signaling if a name has been typed for a new audio
     * @param status
     */
    newAudioNameTyped(status) {
        AppDispatcher.dispatch({
            type: ActionTypes.NEW_AUDIO_NAME_TYPED,
            status: status,
        })
    },

    /**
     * updates the editor with a boolean signaling if a name has been typed for a new scene
     * @param status
     */
    newSceneNameTyped(status) {
        AppDispatcher.dispatch({
            type: ActionTypes.NEW_SCENE_NAME_TYPED,
            status: status,
        })
    },

    /**
     * Dispatch new filter selection for audios
     * @param filter
     */
    updateAudioFilter(filter) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_AUDIO_FILTER,
            filter: filter,
        })
    },

    /**
     * Triggered when creating/editing a new audio
     * @param bool true if creating, false if editing
     */
    isItNew(bool) {
        AppDispatcher.dispatch({
            type: ActionTypes.IS_IT_NEW,
            bool: bool,
        })
    },

    /**
     * Dispatch new filter selection for objects
     * @param filterType 'scene' or 'all'
     */
    updateObjectTypeFilter(filterType) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECTS_TYPE_FILTER,
            filter: filterType,
        })
    },

    /**
     * Dispatch new filter selection for objects' names
     * @param filterType string
     */
    updateObjectNameFilter(filterType) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECTS_NAME_FILTER,
            filter: filterType,
        })
    },

    /**
     * Dispatch new filter selection for scene's name
     * @param filterType string
     */
    updateSceneNameFilter(filterType) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_NAME_FILTER,
            filter: filterType,
        })
    },

    /**
     * Updates intermediate data used for editing scenes
     * @param scene
     */
    updateSceneOptions(scene) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_OPTIONS,
            scene: scene,
        })
    },

    /**
     * Updates intermediate value for object name
     * @param name
     */
    updateObjectNameRightbar(name) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECT_NAME_RIGHTBAR,
            name: name,
        })
    },

    /**
     * Dispatch new filter selection for tags' names
     * @param filter string
     */
    updateTagFilter(filter) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_TAG_FILTER,
            filter: filter,
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
     * @gameId to load a specific game
     */
    loadAllScenes(response, order = null, gameId = null) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_SCENES,
            scenes: response.scenes,
            order: order,
            tags: response.tags,
        });
        response.scenes.forEach(scene => {
            SceneAPI.getByName(scene.name, order, gameId, false);
        })

    },

    /**
     * Dispatch to the stores the Scene received from db
     * @param scene
     * @param order of scenes
     */
    receiveScene(scene, order, creation = true) { //di default passando 2 parametri il terzo sarà come impostato qui, altrimenti prende il valore passato
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_SCENE,
            scene: scene,
            order: order,
            objectsToScene: ObjectToSceneStore.getState(),
            objects: ObjectsStore.getState(),
            creation: creation,
        });
    },

    /**
     * Dispatch current scene update
     * @param uuid of the scene
     */
    updateCurrentScene(uuid) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_SCENE,
            uuid: uuid,
            objects: ObjectsStore.getState(),
            objectsToScene: ObjectToSceneStore.getState(),
            scene: ScenesStore.getState().get(uuid),
        });
    },

    /**
     * Dispatch generic scene update
     * @param scene
     * @param order
     */
    updateScene(scene, order = EditorStateStore.getState().scenesOrder) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE,
            scene: scene,
            order: order,
        });
        SceneAPI.updateScene(scene, scene.tag);
    },

    /**
     * Dispatch scene name update
     * @param scene
     * @param oldName
     * @param order of scenes
     */
    updateSceneName(scene, oldName, order) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_NAME,
            scene: scene,
            oldName: oldName,
            order: order,
        });
        SceneAPI.updateScene(scene, scene.tag);
    },

    /**
     * Dispatch generic scene removal
     * @param scene
     */
    removeScene(scene) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_SCENE,
            scene: scene,
        });
        SceneAPI.deleteScene(scene);
    },

    /**
     * Dispatch all scenes removal
     */
    removeAllScenes() {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_ALL_SCENES,
        })
    },

    /**
     * Sort scenes according to the given order
     * @param order
     */
    sortScenes(order) {
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
    addNewTag(tag) {
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_TAG,
            uuid: tag.uuid,
            tag: tag,
        });
        SceneAPI.saveTag(tag);
    },

    /**
     * Receive single tag from db
     * @param tag
     */
    receiveTag(tag) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_TAG,
            uuid: tag.uuid,
            tag: tag,
        });
    },

    /**
     * Dispatch tag removal
     * @param tag_uuid
     */
    removeTag(tag_uuid) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_TAG,
            uuid: tag_uuid,
        })
    },

    /**
     * Dispatch tag update
     * @param tag
     */
    updateTag(tag) {
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
    addNewObject(scene, object) {
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
     * @param scene_type (to calculate centroid)
     */
    receiveObject(object, scene_type = Values.THREE_DIM) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_OBJECT,
            obj: object,
            scene_type: scene_type,
        })
    },

    /**
     * Dispatch object removal
     * @param scene
     * @param object
     */
    removeObject(scene, object) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_OBJECT,
            scene: scene,
            obj: object,
        })
    },

    /**
     * Dispatch all object selection (rightbar)
     */
    selectAllObjects() {
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_ALL_OBJECTS,
        })
    },

    /**
     * Dispatch current object update (rightbar)
     * @param uuid
     */
    updateCurrentObject(obj) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_OBJECT,
            obj: obj,
        })
    },

    /**
     * Dispatch update of any object to the objects store
     * @param object
     */
    updateObject(object) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECT,
            obj: object,
        })
    },

    /**
     * Dispatch update of any object to the objects store
     * @param object
     * @param scene_type (for calculating centroid)
     */
    editVertices(object, scene_type = Values.THREE_DIM) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_VERTICES,
            obj: object,
            vertices: object.get('vertices'),
            scene_type: scene_type,
        })
    },


    //RULES

    /**
     * Dispatch new Rule (stores also handle scene update)
     * @param scene
     * @param rule
     */
    addNewRule(scene, rule) {
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_RULE,
            scene: scene,
            rule: rule,
        });
        InteractiveObjectAPI.saveRule(scene, rule);
    },

    /**
     * Copy rule inside store
     * @param rule
     */
    copyRule(rule) {
        AppDispatcher.dispatch({
            type: ActionTypes.COPY_RULE,
            rule: rule,
        });
    },

    /**
     * Handles a Rule received from db
     * @param rule
     */
    receiveRule(rule) {
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
    removeRule(scene, rule) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_RULE,
            scene: scene,
            rule: rule,
        });
        InteractiveObjectAPI.removeRule(scene, rule);
    },

    /**
     * Dispatch update of any rule
     * @param rule
     */
    updateRule(rule) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE,
            rule: rule,
        });
        let scene = ScenesStore.getState().get(CentralSceneStore.getState());
        InteractiveObjectAPI.saveRule(scene, rule);
    },


    // [davide] eud editor state
    eudShowCompletions(actionId, role, input) {
        AppDispatcher.dispatch({
            type: ActionTypes.EUD_SHOW_COMPLETIONS,
            actionId: actionId,
            role: role,
            completionText: input,
        })
    },

    eudSaveOriginalObject(objectId) {
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
    addNewAudio(audio) {
        if (audio.isSpatial) {
            AppDispatcher.dispatch({
                type: ActionTypes.ADD_NEW_SPATIAL_AUDIO,
                scene: ScenesStore.getState().get(audio.scene),
                audio: audio,
            });
            AudioAPI.createUpdateSpatialAudio(audio.scene, audio);
        } else {
            AppDispatcher.dispatch({
                type: ActionTypes.ADD_NEW_GLOBAL_AUDIO,
                audio: audio,
            });
            AudioAPI.createUpdateGlobalAudio(audio);
        }

    },

    /**
     * Handles audio received from db
     * @param audio
     */
    receiveAudio(audio) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_GLOBAL_AUDIO,
            audio: audio,
        });
    },

    /**
     * Remove audio from stores and scene, dispatch db update
     * @param audio
     */
    removeAudio(audio) {
        if (audio.isSpatial) {
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
        AudioAPI.deleteAudio(audio.uuid);
    },


    /**
     * Updates audio in stores, dispatch db update
     * @param audio
     */
    updateAudio(audio) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_AUDIO,
            audio: audio,
        });
        if (audio.isSpatial)
            AudioAPI.createUpdateSpatialAudio(audio.scene, audio);
        else
            AudioAPI.createUpdateGlobalAudio(audio);
    },

    //MEDIA

    /**
     * Load all assets (audios, videos and images) to stores
     * @param list received from db
     */
    loadAllAssets(list) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_ASSETS,
            list: list,
        })
    },


    /**
     * receives user data from db and dispatch them to stores
     * @param user
     */
    receiveUser(user) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_USER,
            user: user,
        })
    },

    //STORY EDITOR ACTIONS

    loadAllCollections(response) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_COLLECTIONS,
            response: response,
        });
        response.forEach(collection => {
            StoryAPI.getCollectionByName(collection.name);
        })

    },

    receiveCollection(collection) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_COLLECTION,
            collection: collection
        })
    },

    updateCollection(collection) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_COLLECTION,
            collection: collection,
        })
    },

    removeCollection(collection) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_COLLECTION,
            collection: collection,
        })
    },


    receiveImage(image) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_IMAGE,
            image: image
        })
    },

    updateImage(image) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_IMAGE,
            image: image
        })
    },

    updateStory(story) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_STORY,
            story: story,
        })
    },

    receiveStory(story) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_STORY,
            story: story
        })
    },

    restoreStory(story) {
        AppDispatcher.dispatch({
            type: ActionTypes.RESTORE_STORY,
            story: story
        })
    },

    editStory(uuid, userStory) {
        AppDispatcher.dispatch({
            type: ActionTypes.EDIT_STORY,
            uuid: uuid,
            userStory: userStory
        })
    },

    removeStory(collection, story) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_STORY,
            collection: collection,
            story: story
        })
    },

    startEditingStory(uuid) {
        AppDispatcher.dispatch({
            type: ActionTypes.START_EDITING_STORY,
            uuid: uuid
        })
    },

    stopEditingStory() {
        AppDispatcher.dispatch({
            type: ActionTypes.STOP_EDITING_STORY,
        })
    },

    addFormImage(image) {
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_FORM_IMAGE,
            index: image.index,
            image: image,
        })
    },

    receiveFormImage(image) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_FORM_IMAGE,
            image: image,
        })
    },

    updateFormImage(image) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_FORM_IMAGE,
            index: image.index,
            image: image,
        })
    },

    updateFormImageName(index, name) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_FORM_IMAGE_NAME,
            index: index,
            name: name,
        })
    },
    removeFormImage(index) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_FORM_IMAGE,
            index: index,
        })
    },

    resetFormImage() {
        AppDispatcher.dispatch({
            type: ActionTypes.RESET_FORM_IMAGE,
        })
    },


    updateBotResponse(response) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_RESPONSE,
            intent: response.intent,
            scenaIniziale: response.scenaIniziale,
            scenaFinale: response.scenaFinale,
            oggetto: response.oggetto,
            tipoRisposta: response.tipo,
            statoIniziale: response.statoIniziale,
            statoFinale: response.statoFinale,
        })
    },

    updateBotRule(elementoMancante, response, ultimaRegolaCreata) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_RULE,
            elementoMancante: elementoMancante,
            response: response,
            ultimaRegolaCreata: ultimaRegolaCreata
        })
    },

    updateBotMissingElement(missingElement) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_MISSING_ELEMENT,
            elementoMancante: missingElement
        })
    },
    updateBotObject(object) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_OBJECT,
            oggetto: object
        })
    },
    updateBotFinalScene(finalScene) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_FINAL_SCENE,
            scenaFinale: finalScene
        })
    },

    updateBotInitialState(initialState) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_INITIAL_STATE,
            statoIniziale: initialState
        })
    },

    updateBotFinalState(finalState) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_FINAL_STATE,
            statoFinale: finalState
        })
    },

    updateBotNegationCount(negationCount) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_NEGATION_NUMBER,
            numNegazioni: negationCount
        })
    },

    updateBotInitialScene(initialScene) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_INITIAL_SCENE,
            scenaIniziale: initialScene
        })
    },


    updateBotIntent(intent) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_INTENT,
            intent: intent
        })
    },

    updateBotResponseType(responseType) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_RESPONSE_TYPE,
            tipoRisposta: responseType
        })
    },

    updateBotLastRule(lastRule){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_BOT_LAST_RULE,
            ultimaRegolaCreata: lastRule
        })
    },

    resetBotRule() {
        AppDispatcher.dispatch({
            type: ActionTypes.RESET_BOT_RULE,
        })
    },

};

export default Actions;