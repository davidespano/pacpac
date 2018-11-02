import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';

class RulesStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.ADD_NEW_RULE:
                state = state.set(action.rule.uuid, action.rule);
                return state;
            case ActionTypes.RECEIVE_RULE:
                state = state.set(action.rule.uuid, action.rule);
                return state;
            case ActionTypes.REMOVE_RULE:
                state = state.delete(action.rule.uuid);
                return state;
            case ActionTypes.UPDATE_RULE:
                state = state.set(action.rule.uuid, action.rule);
                return state;
            default:
                return state;
        }
    }
}

export default new RulesStore();