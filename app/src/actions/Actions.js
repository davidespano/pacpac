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
        })
    },

    receiveScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.GET_SCENE_RESPONSE,
            scene: scene,
        })
    },

    updateCurrentScene(scene){
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENT_SCENE,
            scene: scene,
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

    addNewTransition(transition){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_NEW_TRANSITION,
            obj: transition,
        })
    },


    addNewObject(object){
      AppDispatcher.dispatch({
          type: ActionTypes.ADD_NEW_OBJECT,
          object: object,
      })
    },

    selectAllObjects(){
        AppDispatcher.dispatch({
            type: ActionTypes.SELECT_ALL_OBJECTS,
        })
    },

    //OTHER

    onDrop(picture){
        AppDispatcher.dispatch({
            type: ActionTypes.ON_PICTURE_DROP,
            picture,
        })
    },


};

export default Actions;