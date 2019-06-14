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
        let objects;

        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                return state.set(action.obj.uuid, action.scene.uuid);
            case ActionTypes.REMOVE_OBJECT:
                return state.delete(action.obj.uuid);;
            case ActionTypes.REMOVE_SCENE:

                objects = scene_utils.allObjects(action.scene);
                objects.forEach(obj => state = state.delete(obj));

                return state;
            case ActionTypes.RECEIVE_SCENE:

                objects = scene_utils.allObjects(action.scene);
                objects.forEach(obj => state = state.set(obj, action.scene.uuid));

                return state;
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state;
        }
    }
}

export default new ObjectToSceneStore();