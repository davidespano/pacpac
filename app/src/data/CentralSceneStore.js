import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Scene from '../scene/Scene';
import Immutable from "immutable";
import EditorStateStore from "./EditorStateStore";

class CentralSceneStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return null;
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.RECEIVE_SCENE:
                if(action.creation) //se stiamo creando una nuova scena la visualizziamo nell'interfaccia
                {
                    if (action.scene.uuid != "ghostScene")
                    return action.scene.uuid;
                }
                else //altrimenti stiamo probabilmente caricando le scene e vogliamo la home scene
                {
                    if(action.scene.uuid === EditorStateStore.getState().homeScene)
                        return action.scene.uuid;
                };
                return state;
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return action.uuid;
            case ActionTypes.REMOVE_SCENE:
                return null;
            case ActionTypes.RESET:
                return null;
            default:
                return state;
        }
    }
}

export default new CentralSceneStore();
