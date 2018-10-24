import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';
import SceneAPI from '../utils/SceneAPI';

const Actions = {

    //EDITOR MODE

    playModeOn(){
        AppDispatcher.dispatch({
            type: ActionTypes.PLAY_MODE_ON
        })
    },

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

    //SCENES

    addScene(name, tag){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_SCENE,
            name: name,
            tag: tag,
        })
    },

    clickScene(x, y){
        AppDispatcher.dispatch({
            type: ActionTypes.CLICK_SCENE,
            x: x,
            y: y,
        })
    },

    getScene(name){
        AppDispatcher.dispatch({
            type: ActionTypes.GET_SCENE,
        });
        SceneAPI.getByName(name);
    },

    loadAllScenes(response){
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_ALL_SCENES,
            response: response,
        });
        response.forEach(scene => {
            SceneAPI.getByName(scene.name);
        })

    },

    receiveScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_SCENE,
            scene: scene,
        });
    },

    updateCurrentScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_SCENE,
            scene: scene,
        })

    },

    updateScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SCENE,
            scene: scene,
        })
    },

    removeScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_SCENE,
            scene: scene,
        })
    },

    removeAllScene(){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_ALL_SCENES,
        })
    },

    //LABELS

    addNewTag(name, color){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_TAG,
            name: name,
            color: color,
        })
    },


    //INTERACTIVE OBJECTS

    addNewObject(object){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_OBJECT,
            obj: object,
        })
    },

    removeObject(scene, object){
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_OBJECT,
            scene: scene,
            obj: object,
        })
    },

    selectAllObjects(){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_ALL_OBJECTS,
        })
    },

    updateCurrentObject(object){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_OBJECT,
            obj: object,
        })
    },

    filterObject(filterType){
        AppDispatcher.dispatch({
            type: ActionTypes.OBJECTS_FILTER,
            filter: filterType,
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