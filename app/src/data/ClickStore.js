import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from "immutable";

class ClickStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return {
            x: 0,
            y: 0,
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.CLICK_SCENE:
                //console.log('x: ' + action.x + ' y: ' + action.y);
                return {
                    x: action.x,
                    y: action.y,
                };
            case ActionTypes.RESET:
                return {x:0, y:0};
            default:
                return state;
        }
    }
}

export default new ClickStore();
