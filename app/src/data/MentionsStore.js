import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import Mentions from "./Mentions";
import ActionTypes from "../actions/ActionTypes";
import scene_utils from "../scene/scene_utils";


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
        let objectsToKeep = [];

        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                entry = {
                    name: action.obj.name ,
                    uuid: action.obj.uuid,
                    link: '#',
                    type: 'oggetto'
                };
                objects.push(entry);
                return state.set('objects', objects);
            case ActionTypes.UPDATE_OBJECT:

                objects = objects.map(obj => {
                    if(obj.uuid === action.obj.get('uuid')){
                        obj.name = action.obj.name ;
                    }
                    return obj;
                });
                return state.set('objects', objects);
            case ActionTypes.RECEIVE_OBJECT:
                entry = {
                    name: action.obj.name ,
                    uuid: action.obj.uuid,
                    link: '#',
                    type: 'oggetto',
                };
                objects.push(entry);
                return state.set('objects', objects);
            case ActionTypes.REMOVE_OBJECT:
                objects = objects.filter(obj => obj.uuid !== action.obj.uuid);
                return state.set('objects', objects);
            case ActionTypes.RECEIVE_SCENE:
                entry = {
                    name: action.scene.name ,
                    uuid: action.scene.uuid,
                    link: '#',
                    type: 'scena',
                };
                scenes.push(entry);

                objectsToKeep = scene_utils.allObjects(action.scene);
                objects = objects.filter(obj => objectsToKeep.includes(obj.uuid)).map(obj => {
                    obj.type = 'oggettoScena';
                    return obj;
                });

                return state.set('scenes', scenes).set('objectsScene', objects);
            case ActionTypes.UPDATE_CURRENT_SCENE:

                objectsToKeep = scene_utils.allObjects(action.scene);
                objects = objects.filter(obj => objectsToKeep.includes(obj.uuid)).map(obj => {
                    obj.type = 'oggettoScena';
                    return obj;
                });

                return state.set('objectsScene', objects);
            case ActionTypes.UPDATE_SCENE_NAME:

                scenes = scenes.map(s => {
                    if(s.uuid === action.scene.get('uuid')){
                        s.name = action.scene.name ;
                    }
                    return s;
                });

                return state.set('scenes', scenes);
            case ActionTypes.REMOVE_SCENE:
                scenes = scenes.filter(s => s.uuid !== action.scene.uuid);

                objects = objects.filter(obj => obj.uuid !== action.scene.uuid);

                return state.set('scenes', scenes).set('objects', objects);
            default:
                return state;
        }
    }
}

export default new MentionsStore();