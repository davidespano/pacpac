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
};

export default Actions;