import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Scene from "../scene/Scene";
import scene_utils from '../scene/scene_utils';
import rules_utils from "../interactives/rules/rules_utils";

class ScenesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {
        let newScene;
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
                            rules: [],
                            objects: {
                                transitions: [],
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
            case ActionTypes.ADD_NEW_OBJECT:
                newScene = scene_utils.addInteractiveObjectToScene(action.scene, action.obj);
                state = state.set(newScene.name, newScene);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                newScene = scene_utils.removeInteractiveObject(action.scene, action.obj);
                state = state.set(newScene.name, newScene);
                return state;
            case ActionTypes.ADD_NEW_RULE:
                newScene = scene_utils.addRuleToScene(action.scene, action.rule);
                state = state.set(newScene.name, newScene);
                return state;
            case ActionTypes.REMOVE_RULE:
                newScene = scene_utils.removeRuleFromScene(action.scene, action.rule);
                console.log(newScene)
                state = state.set(newScene.name, newScene);
                return state;
            default:
                return state;
        }
    }
}

export default new ScenesStore();
