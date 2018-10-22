import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import LeftbarElement from "./LeftbarElement";
import Scene from "../scene/Scene";

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
                    // for each scene in db create new Scene object
                    action.response.forEach(function(scene){
                        let newScene = Scene({
                            name : scene.name.replace(/\.[^/.]+$/, ""),
                            img : scene.name,
                            index : scene.index,
                            type : scene.type,
                            tag : {
                                tagName : scene.tagName,
                                tagColor : scene.tagColor,
                            },
                        });
                        state = state.set(newScene.name, newScene);
                    });
                }
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.set(action.scene.name, action.scene);
                return state;
            case ActionTypes.REMOVE_SCENE:
                state = state.delete(action.scene.name);
                return state;
            case ActionTypes.UPDATE_SCENE:
                state = state.set(action.scene.name, action.scene);
                return state;
            case ActionTypes.REMOVE_ALL_SCENES:
                state = state.clear();
                return state;
            case ActionTypes.REMOVE_TRANSITION:
                const scene = action.scene;
                const newTransitions = scene.objects.transitions.filter((transition) => transition.uuid !== action.obj.uuid);
                scene.objects.transitions = newTransitions;
                state = state.set(scene.name,scene);
                return state;
            default:
                return state;
        }
    }
}

export default new ScenesStore();
