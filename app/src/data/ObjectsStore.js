import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import stores_utils from "./stores_utils";
import scene_utils from "../scene/scene_utils";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import InteractiveObjectAPI from "../utils/InteractiveObjectAPI";

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
                let obj = action.obj;
                if (action.obj.type === InteractiveObjectsTypes.KEYPAD){
                    //Quando creo un tastierino, aggiorno tutti i pulsanti della scena per esserne parte
                    let buttons = action.scene.objects.buttons;
                    if (buttons.length !== 0){
                        buttons.forEach(b => {
                            let currentB = state.get(b);
                            let properties = currentB.get('properties');
                            properties['keypadUuid'] = obj.uuid;
                            let new_b = currentB.setIn(['properties'], properties);
                            state = state.set(new_b.uuid, new_b)
                            InteractiveObjectAPI.saveObject(action.scene, new_b);
                            //inserisco i valori dei pulsanti e i loro uuid nel tastierino
                            properties = obj.get('properties');
                            properties['buttonsValues'][new_b.uuid] = null;
                            obj = obj.setIn(['properties'], properties);
                        })
                    }
                }

                if (action.obj.type === InteractiveObjectsTypes.BUTTON){
                    let keypad = action.scene.objects.keypads;
                    if (keypad.length !== 0){
                        keypad.forEach(k => {
                            //aggiungo al tastierino il pulsante appena creato
                            let currentK = state.get(k);
                            let properties = currentK.get('properties');
                            properties['buttonsValues'][obj.uuid] = null;
                            let new_k = currentK.setIn(['properties'], properties);
                            state = state.set(new_k.uuid, new_k)
                            InteractiveObjectAPI.saveObject(action.scene, new_k);
                            //assegno il uuid del tastierino alla proprietà del pulsante
                            properties = obj.get('properties');
                            properties['keypadUuid'] = new_k.uuid;
                            obj = obj.setIn(['properties'], properties);
                        })
                    }
                }
                state = state.set(obj.uuid, obj).sort(stores_utils.alphabetical); //Aggiornamento dello stato
                return state;
            case ActionTypes.RECEIVE_OBJECT:
                state = state.set(action.obj.uuid, action.obj).sort(stores_utils.alphabetical);
                return state;
            case ActionTypes.REMOVE_OBJECT:

                console.log("rimozione oggetto: ", action.obj);
                if (action.obj.type === InteractiveObjectsTypes.BUTTON) {
                    let keypad = action.scene.objects.keypads;
                    if (keypad.length !== 0){
                        keypad.forEach(k => {
                            //aggiungo al tastierino il pulsante appena creato
                            let currentK = state.get(k);
                            let properties = currentK.get('properties');
                            //properties['buttonsValues'][obj.uuid] = null;
                            delete properties['buttonsValues'][action.obj.uuid];
                            let new_k = currentK.setIn(['properties'], properties);
                            state = state.set(new_k.uuid, new_k)
                            InteractiveObjectAPI.saveObject(action.scene, new_k);
                        })
                    }
                }
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