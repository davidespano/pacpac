import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import stores_utils from "./stores_utils";
import Orders from "./Orders";

class AudioStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.OrderedMap();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_GLOBAL_AUDIO:
                return state.set(action.audio.uuid, action.audio).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));
            case ActionTypes.ADD_NEW_SPATIAL_AUDIO:
                return state.set(action.audio.uuid, action.audio).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));
            case ActionTypes.RECEIVE_GLOBAL_AUDIO:
                return state.set(action.audio.uuid, action.audio).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));
            case ActionTypes.RECEIVE_SPATIAL_AUDIO:
                return state.set(action.audio.uuid, action.audio).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));
            case ActionTypes.REMOVE_GLOBAL_AUDIO:
                return state.delete(action.audio.uuid);
            case ActionTypes.REMOVE_SPATIAL_AUDIO:
                return state.delete(action.audio.uuid);
            case ActionTypes.REMOVE_SCENE:
                action.scene.get('audios').map(audio => {
                    state = state.delete(audio)
                });
                return state;
            case ActionTypes.UPDATE_AUDIO:
                return state.set(action.audio.uuid, action.audio).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state;
        }
    }
}

export default new AudioStore();