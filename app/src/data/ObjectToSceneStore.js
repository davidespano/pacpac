import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';
import ObjectsStore from "./ObjectsStore";
import Immutable from 'immutable';
import scene_utils from "../scene/scene_utils";

class ObjectToSceneStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                state = state.set(action.obj.uuid, action.scene.name);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                state = state.delete(action.obj.uuid);
                return state;
            case ActionTypes.REMOVE_SCENE:

                let objects = scene_utils.allObjects(action.scene);
                objects.forEach(obj => state = state.delete(obj));

                return state;
            case ActionTypes.RECEIVE_SCENE:

                let objects = scene_utils.allObjects(action.scene);
                objects.forEach(obj => state = state.set(obj, action.scene.name));

                return state;
            default:
                return state;
        }
    }
}

export default new ObjectToSceneStore();