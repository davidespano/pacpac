import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';

class AudioStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_GLOBAL_AUDIO:
                return state.set(action.audio.uuid, action.audio);
            case ActionTypes.ADD_NEW_LOCAL_AUDIO:
                return state.set(action.audio.uuid, action.audio);
            case ActionTypes.REMOVE_GLOBAL_AUDIO:
                return state.delete(action.audio.uuid);
            case ActionTypes.REMOVE_LOCAL_AUDIO:
                return state.delete(action.audio.uuid);
            case ActionTypes.UPDATE_AUDIO:
                return state.set(action.audio.uuid, action.audio);
            default:
                return state;
        }
    }
}

export default new AudioStore();