import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import stores_utils from "./stores_utils";
import scene_utils from "../scene/scene_utils";


class ObjectsStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    //[Vittoria] Restituisce lo stato iniziale dello store quando l'interfaccia viene avviata
    //Immutable è un oggetto che non può essere modificato
    getInitialState(){
        return Immutable.OrderedMap();
    }
    /*[Vittoria] Aggiorna lo store, state  è quello che passiamo attraverso il Dispatcher in Actions.js
    lo state è Immutable; per modificarlo l'unico modo è assegnare a sè stesso un nuovo valore, vedi state = state.set
    state.set va comunque a creare una nuova variabile, quindi per aggiornare state lo riassegno */
    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.alphabetical); //Aggiornamento dello stato
                return state;
            case ActionTypes.RECEIVE_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.alphabetical);
                return state;
            case ActionTypes.REMOVE_OBJECT:
                state = state.delete(action.obj.uuid);
                return state;
            case ActionTypes.UPDATE_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.alphabetical);
                return state;
            case ActionTypes.REMOVE_SCENE:

                let objects = scene_utils.allObjects(action.scene);
                objects.forEach(obj => state = state.delete(obj));

                return state;
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state; //[Vittoria] se lo Store non contiene l'azione chiamata finisco nello stato di default e non viene aggiornato niente
        }
    }
}

export default new ObjectsStore();