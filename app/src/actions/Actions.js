import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';
import SceneAPI from '../utils/SceneAPI';

const Actions = {
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

    addScene(name){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_SCENE,
            name,
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
        })
        SceneAPI.getByName(name);
    },

    receiveScene(response){
        AppDispatcher.dispatch({
            type: ActionTypes.GET_SCENE_RESPONSE,
            response: response
        })
    },

    onDrop(picture){
        AppDispatcher.dispatch({
            type: ActionTypes.ON_PICTURE_DROP,
            picture,
        })
    },


};

export default Actions;