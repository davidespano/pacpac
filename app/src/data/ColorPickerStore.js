import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';


class ColorPickerStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return {
            stdColors: ['#FFFFFF', '#123456', '#654321', '#000000'],
            recentColors: [],
        };
    }

    reduce(state, action) {
        switch (action.type) {
            default:
                console.log('PASSO QUI');
                return state;
        }
    }
}

export default new ColorPickerStore();
