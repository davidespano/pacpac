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
                            uuid: scene.uuid,
                            name : scene.name,
                            img : scene.img,
                            index : scene.index,
                            isAudioOn: scene.isAudioOn,
                            isVideoInALoop: scene.isVideoInALoop,
                            type : scene.type,
                            music : scene.music,
                            sfx: scene.sfx,
                            tag : tag,
                            rules: [],
                            audios : [],
                            objects: {
                                transitions: [],
                                switches: [],
                                collectable_keys: [],
                                locks: [],
                                keypads: [],
                            },
                        });
                        state = state.set(newScene.uuid, newScene).sort(stores_utils.chooseComparator(action.order));
                    });
                }
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.set(action.scene.uuid, action.scene).sort(stores_utils.chooseComparator(action.order));
                return state;
            case ActionTypes.REMOVE_ALL_SCENES:
                state = state.clear();
                return state;
            case ActionTypes.REMOVE_SCENE:
                state = state.delete(action.scene.uuid);
                return state;
            case ActionTypes.SORT_SCENES:
                state = state.sort(stores_utils.chooseComparator(action.order));
                return state;
            case ActionTypes.UPDATE_SCENE:
                state = state.set(action.scene.uuid, action.scene);
                return state;
            case ActionTypes.UPDATE_SCENE_NAME:
                return state.set(action.scene.uuid, action.scene).sort(stores_utils.chooseComparator(action.order));
            case ActionTypes.REMOVE_TAG:

                state = state.mapEntries(function ([k,v]){
                    if(v.tag === action.uuid){
                        v = v.set('tag', 'default');
                    }
                    return ([k,v]);
                });


                return state;
            case ActionTypes.ADD_NEW_OBJECT:
                newScene = scene_utils.addInteractiveObjectToScene(action.scene, action.obj);
                state = state.set(newScene.uuid, newScene);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                newScene = scene_utils.removeInteractiveObject(action.scene, action.obj);
                state = state.set(newScene.uuid, newScene);
                return state;
            case ActionTypes.ADD_NEW_RULE:
                newScene = scene_utils.addRuleToScene(action.scene, action.rule);
                state = state.set(newScene.uuid, newScene);
                return state;
            case ActionTypes.REMOVE_RULE:
                newScene = scene_utils.removeRuleFromScene(action.scene, action.rule);
                state = state.set(newScene.uuid, newScene);
                return state;
            case ActionTypes.ADD_NEW_SPATIAL_AUDIO:
                newScene = scene_utils.addAudioToScene(action.scene, action.audio.uuid);
                return state.set(newScene.uuid, newScene);
            case ActionTypes.REMOVE_SPATIAL_AUDIO:
                newScene = scene_utils.removeAudioFromScene(action.scene, action.audio.uuid);
                return state.set(newScene.uuid, newScene);
            case ActionTypes.RESET:
                return Immutable.OrderedMap();
            default:
                return state;
        }
    }
}

export default new ScenesStore();
