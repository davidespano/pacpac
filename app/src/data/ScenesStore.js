import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Scene from "../scene/Scene";
import scene_utils from '../scene/scene_utils';
import stores_utils from "./stores_utils";

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
                    action.scenes.forEach(function(scene){

                        let tag = scene.tag.uuid ? scene.tag.uuid : "default";

                        let newScene = Scene({
                            name : scene.name.replace(/\.[^/.]+$/, ""),
                            img : scene.name,
                            index : scene.index,
                            type : scene.type,
                            tag : tag,
                            rules: [],
                            objects: {
                                transitions: [],
                                switches: [],
                            },
                        });
                        state = state.set(newScene.name, newScene).sort(stores_utils.chooseComparator(action.order));
                    });
                }
                console.log(state);
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.set(action.scene.name, action.scene).sort(stores_utils.chooseComparator(action.order));
                return state;
            case ActionTypes.REMOVE_ALL_SCENES:
                state = state.clear();
                return state;
            case ActionTypes.REMOVE_SCENE:
                state = state.delete(action.scene.name);
                return state;
            case ActionTypes.SORT_SCENES:
                state = state.sort(stores_utils.chooseComparator(action.order));
                return state;
            case ActionTypes.UPDATE_SCENE:
                state = state.set(action.scene.name, action.scene);
                return state;
            case ActionTypes.UPDATE_SCENE_NAME:
                state = state.delete(action.oldName);
                return state.set(action.scene.name, action.scene).sort(stores_utils.chooseComparator(action.order));
            case ActionTypes.REMOVE_TAG:

                state = state.mapEntries(function ([k,v]){
                    if(v.tag === action.uuid){
                        return ([k, v.setProperty('tag', 'default')]);
                    }
                });

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
                state = state.set(newScene.name, newScene);
                return state;
            default:
                return state;
        }
    }
}

export default new ScenesStore();
