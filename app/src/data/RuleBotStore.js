import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
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
            case ActionTypes.UPDATE_BOT_INTENT:
                state = state.set('intent', action.intent);
                return state;
            case ActionTypes.UPDATE_BOT_OBJECT:
                state = state.set('oggetto', action.oggetto);
                return state;
            case ActionTypes.UPDATE_BOT_INITIAL_SCENE:
                state = state.set('scenaIniziale', action.scenaIniziale);
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
            case ActionTypes.UPDATE_BOT_NEGATION_NUMBER:
                state = state.set('numNegazioni', action.numNegazioni);
                return state;
            case ActionTypes.UPDATE_BOT_MISSING_ELEMENT:
                state = state.set('elementoMancante', action.elementoMancante);
                return state;
            case ActionTypes.UPDATE_BOT_RESPONSE_TYPE:
                state = state.set('tipoRisposta', action.tipoRisposta);
                return state;
            case ActionTypes.UPDATE_BOT_LAST_RULE:
                state = state.set('ultimaRegolaCreata', action.ultimaRegolaCreata);
                return state;
            case ActionTypes.UPDATE_BOT_RESPONSE:
                state = state.set('intent', action.intent);
                state = state.set('scenaIniziale', action.scenaIniziale);
                state = state.set('scenaFinale', action.scenaFinale);
                state = state.set('oggetto', action.oggetto);
                state = state.set('tipoRisposta', action.tipoRisposta);
                state = state.set('statoIniziale', action.statoIniziale);
                state = state.set('statoFinale', action.statoFinale);
                state = state.set('numNegazioni', action.numNegazioni);
                return state;
            case ActionTypes.RESET_BOT_RULE:
                return RuleBotState();
            default:
                return state;
        }
    }
}

export default new RuleBotStore();