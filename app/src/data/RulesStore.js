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
            case ActionTypes.REMOVE_OBJECT:
                state = state.map(rule => {
                    let event = rule.get('event');
                    console.log(action.obj);

                    //check event
                    if(event.get('subj_uuid') === action.obj.get('uuid')){
                        event = event.set('subj_uuid', null);
                    }
                    if(event.get('obj_uuid') === action.obj.get('uuid')){
                        event = event.set('obj_uuid', null);
                    }

                    // check actions
                    let actions = rule.get('actions').map(a => {
                        if(a.get('subj_uuid') === action.obj.get('uuid')){
                            a = a.set('subj_uuid', null);
                        }
                        if(a.get('obj_uuid') === action.obj.get('uuid')){
                            a = a.set('obj_uuid', null);
                        }
                        return a;
                    });

                    return rule.set('actions', actions).set('event', event);
                });
                return state;
            case ActionTypes.REMOVE_SCENE:
                action.scene.get('rules').map(rule => {
                    state = state.delete(rule)
                });
                return state;
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state;
        }
    }
}

export default new RulesStore();