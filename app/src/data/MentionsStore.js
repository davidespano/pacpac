import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import Mentions from "./Mentions";
import ActionTypes from "../actions/ActionTypes";


class MentionsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Mentions();
    }

    reduce(state, action){
        let entry = {};
        let objects = state.get('objects');
        let scenes = state.get('scenes');

        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                entry = {
                    name: action.obj.name,
                    uuid: action.obj.uuid,
                };
                objects.push(entry);
                return state.set('objects', objects);
            case ActionTypes.RECEIVE_OBJECT:
                entry = {
                    name: action.obj.name,
                    uuid: action.obj.uuid,
                };
                objects.push(entry);
                return state.set('objects', objects);
            case ActionTypes.RECEIVE_SCENE:
                entry = {
                    name: action.scene.name,
                    uuid: action.scene.uuid,
                };
                scenes.push(entry);

                objects = objects.filter(obj => {
                    let scene = action.objectsToScene.get(obj.uuid);
                    return scene === action.name;
                });

                return state.set('scenes', scenes).set('objectsScene', objects);
            case ActionTypes.UPDATE_CURRENT_SCENE:

                objects = objects.filter(obj => {
                   let scene = action.objectsToScene.get(obj.uuid);
                   return scene === action.name;
                });

                return state.set('objectsScene', objects);

            default:
                return state;
        }
    }
}

export default new MentionsStore();