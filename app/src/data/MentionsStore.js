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
        switch(action.type){
            case ActionTypes.ADD_NEW_OBJECT:
                entry = {
                    name: action.obj.name,
                };
                return state.set('objects', state.get('objects').set(action.obj.uuid, entry));
            case ActionTypes.RECEIVE_OBJECT:
                entry = {
                    name: action.obj.name,
                };
                return state.set('objects', state.get('objects').set(action.obj.uuid, entry));
            default:
                return state;
        }
    }
}

export default new MentionsStore();