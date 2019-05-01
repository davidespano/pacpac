import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Scene from "../scene/Scene";
import scene_utils from '../scene/scene_utils';
import stores_utils from "./stores_utils";
import Asset from "./Asset";

class AssetsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.Map();
    }

    reduce(state, action) {
        let a;

        switch (action.type) {
            case ActionTypes.LOAD_ALL_ASSETS:
                // if state isn't undefined
                if(state) {
                    action.list.push('gnigni.mp4')
                    action.list.forEach(a => {
                        state = state.set(a, Asset({name: a, uuid: a, type: stores_utils.getFileType(a)}));
                    })
                }
                return state;
            case ActionTypes.RECEIVE_SCENE:
                a = action.scene.img;
                return state.set(a, Asset({name: a, uuid: a}));
            default:
                return state;
        }
        return state;
    }
}

export default new AssetsStore();