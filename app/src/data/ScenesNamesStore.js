import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Scene from "../scene/Scene";
import scene_utils from '../scene/scene_utils';
import stores_utils from "./stores_utils";

class ScenesNamesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.Set();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.LOAD_ALL_SCENES:
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new Scene object
                    action.scenes.forEach(function(scene){
                        state = state.add(scene.name)});
                }
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.add(action.scene.name);
                return state;
            case ActionTypes.REMOVE_ALL_SCENES:
                state = state.clear();
                return state;
            case ActionTypes.REMOVE_SCENE:
                return state.delete(action.scene.name);
            case ActionTypes.UPDATE_SCENE_NAME:
                return state.delete(action.oldName).add(action.scene.name);
            case ActionTypes.RESET:
                return Immutable.Set();
            default:
                return state;
        }
    }
}

export default new ScenesNamesStore();
