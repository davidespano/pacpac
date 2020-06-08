import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Actions from '../actions/Actions'

class RuleBotStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return {
            elementoMancante: "",
            response: {
                intent: "",
                scenaIniziale: "",
                scenaFinale: "",
                oggetto: "",
                tipo: "regola",
            },
            ultimaRegolaCreata: ""
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.UPDATE_BOT_RULE:
                state = {
                    elementoMancante: action.elementoMancante,
                    response: action.response,
                    ultimaRegolaCreata: action.ultimaRegolaCreata,
                };
                return state;
            case ActionTypes.RESET_BOT_RULE:
                state = {
                    elementoMancante: "",
                    response: {
                        intent: "",
                        scenaIniziale: "",
                        scenaFinale: "",
                        oggetto: "",
                        tipo: "regola",
                    },
                    ultimaRegolaCreata: ""
                };
                return state;
            default:
                return state;
        }
    }
}

export default new RuleBotStore();