import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';


class  extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return [];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ON_PICTURE_DROP:
                console.log("PICTUREZZZZ");
                return state.concat(action.picture);
            default:
                return state;
        }
    }
}

export default new ();
