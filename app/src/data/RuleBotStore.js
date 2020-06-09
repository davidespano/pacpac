import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Actions from '../actions/Actions'
import RuleBotState from "./RuleBotState";

class RuleBotStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return RuleBotState();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.UPDATE_BOT_RULE:
                state = state.set('elementoMancante', action.elementoMancante);
                state = state.set('intent', action.response.intent);
                state = state.set('scenaIniziale', action.response.scenaIniziale);
                state = state.set('scenaFinale', action.response.scenaFinale);
                state = state.set('oggetto', action.response.oggetto);
                state = state.set('tipo', action.response.tipo);
                state = state.set('ultimaRegolaCreata', action.ultimaRegolaCreata);
                return state;
            case ActionTypes.RESET_BOT_RULE:
                return RuleBotState();
            case ActionTypes.UPDATE_BOT_RESPONSE:
                state = state.set('intent', action.intent);
                state = state.set('scenaIniziale', action.scenaIniziale);
                state = state.set('scenaFinale', action.scenaFinale);
                state = state.set('oggetto', action.oggetto);
                state = state.set('tipo', action.tipo);
                return state;
            case ActionTypes.UPDATE_BOT_MISSING_ELEMENT:
                state = state.set('elementoMancante', action.elementoMancante);
                return state;
            case ActionTypes.UPDATE_BOT_OBJECT:
                state = state.set('oggetto', action.oggetto);
                return state;
            case ActionTypes.UPDATE_BOT_FINAL_SCENE:
                state = state.set('scenaFinale', action.scenaFinale);
                return state;
            case ActionTypes.UPDATE_BOT_INITIAL_STATE:
                state = state.set('statoIniziale', action.statoIniziale);
                return state;
            case ActionTypes.UPDATE_BOT_FINAL_STATE:
                state = state.set('statoFinale', action.statoFinale);
                return state;
            default:
                return state;
        }
    }
}

export default new RuleBotStore();