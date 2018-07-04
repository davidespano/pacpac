import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';


class LabelsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return [{
            title: 'Nessuna',
            color: 'black',
        }];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_NEW_LABEL:
                return state.push({
                    title: action.title,
                    color: action.color,
                });
            case ActionTypes.LOAD_ALL_LABELS:
                return state;
            default:
                return state;
        }
    }
}

export default new LabelsStore();
