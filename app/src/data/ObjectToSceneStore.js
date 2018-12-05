import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';
import ObjectsStore from "./ObjectsStore";
import Immutable from 'immutable';

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
                console.log(state);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                state = state.delete(action.obj.uuid);
                return state;
            case ActionTypes.REMOVE_SCENE:

                let objects = action.scene.get('objects');
                objects.transitions.forEach(obj_uuid => {
                    state = state.delete(obj_uuid);
                });
                objects.switches.forEach(obj_uuid => {
                    state = state.delete(obj_uuid);
                });

                return state;
            case ActionTypes.RECEIVE_SCENE:

                let objs = action.scene.get('objects');
                objs.transitions.forEach(obj_uuid => {
                    state = state.set(obj_uuid, action.scene.name);
                });
                objs.switches.forEach(obj_uuid => {
                    state = state.set(obj_uuid, action.scene.name);
                });

                return state;
            default:
                return state;
        }
    }
}

export default new ObjectToSceneStore();