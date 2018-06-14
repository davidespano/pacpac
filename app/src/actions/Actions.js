import ActionTypes from './ActionTypes';
import AppDispatcher from '../data/AppDispatcher';

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

    addScene(id, name, img){
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_SCENE,
            id: id,
            name: name,
            img: img,
        })
    },

    clickScene(x, y){
        AppDispatcher.dispatch({
            type: ActionTypes.CLICK_SCENE,
            x: x,
            y: y,
        })
    }
};

export default Actions;