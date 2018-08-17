import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import LeftbarElement from "./LeftbarElement";
import MyScene from "../scene/MyScene";

class ScenesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.LOAD_ALL_SCENES:
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new MyScene object
                    action.response.forEach(function(scene){
                        let newScene = new MyScene(
                            scene.name,
                            scene.tagName,
                            scene.tagColor,
                        );
                        state = state.set(newScene.name, newScene);
                    });
                }
                return state;
            case ActionTypes.GET_SCENE_RESPONSE:
                state = state.set(action.scene.name, action.scene);
                return state;
            case ActionTypes.REMOVE_SCENE:
                state = state.delete(action.scene_name);
                return state;
            case ActionTypes.UPDATE_SCENE:
                state = state.set(action.scene.name, action.scene);
                return state;
            case ActionTypes.REMOVE_ALL_SCENES:
                state = state.clear();
                return state;
            case ActionTypes.REMOVE_TRANSITION:
                const scene = action.scene;
                const newTransiotions = scene.transitions.filter((transition) => transition.uuid != action.obj.uuid);
                scene.transitions = newTransiotions;
                state = state.set(scene.name,scene);
                return state;
            default:
                return state;
        }
    }
}

export default new ScenesStore();
