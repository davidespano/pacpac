import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';
import SceneAPI from '../utils/SceneAPI';

const Actions = {

    //EDITOR

    /**
     * This functions handle editor state variables (such as current mode and selected menus)
     **/

    editModeOn() {
        AppDispatcher.dispatch({
            type: ActionTypes.EDIT_MODE_ON
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

    rightbarSelection(selection){
        AppDispatcher.dispatch({
            type: ActionTypes.RIGHTBAR_SELECTION,
            selection: selection,
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
     */
    loadAllScenes(response){
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_SCENES,
            response: response,
        });
        response.forEach(scene => {
            SceneAPI.getByName(scene.name);
        })

    },

    /**
     * Dispatch to the stores the Scene received from db
     * @param scene
     */
    receiveScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_SCENE,
            scene: scene,
        });
    },

    /**
     * Dispatch current scene update
     * @param name of the scene
     */
    updateCurrentScene(name){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_SCENE,
            name: name,
        })

    },

    /**
     * Dispatch generic scene update
     * @param scene
     */
    updateScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE,
            scene: scene,
        })
    },

    /**
     * Dispatch scene name update (since the name is the scene key in ScenesStore map, it needs a specific update)
     * @param scene
     * @param oldName
     */
    updateSceneName(scene, oldName){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE_NAME,
            scene: scene,
            oldName: oldName,
        })
    },

    /**
     * Dispatch generic scene removal
     * @param scene
     */
    removeScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_SCENE,
            scene: scene,
        })
    },

    /**
     * Dispatch all scenes removal
     */
    removeAllScene(){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_ALL_SCENES,
        })
    },

    //TAGS

    /**
     * Dispatch creation of new tag
     * @param name
     * @param color
     */
    addNewTag(name, color){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_TAG,
            name: name,
            color: color,
        })
    },


    //INTERACTIVE OBJECTS

    /**
     * Adds new object (also handles generation of default rule and scene update)
     * @param scene
     * @param object
     */
    addNewObject(scene, object){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_OBJECT,
            scene: scene,
            obj: object,
        })
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

    /**
     * Dispatch new filter selection
     * @param filterType
     */
    filterObject(filterType){
        AppDispatcher.dispatch({
            type: ActionTypes.OBJECTS_FILTER,
            filter: filterType,
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
        })
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
    },

    /**
     * Dispatch update of any rule
     * @param rule
     */
    updateRule(rule){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_RULE,
            rule: rule,
        })
    },

    //OTHER

    onDrop(picture){
        AppDispatcher.dispatch({
            type: ActionTypes.ON_PICTURE_DROP,
            picture,
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