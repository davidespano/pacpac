import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import Scene from "../scene/Scene";
import scene_utils from '../scene/scene_utils';
import stores_utils from "./stores_utils";

class AssetsStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.OrderedSet();
    }

    reduce(state, action) {
        let newScene;

        switch (action.type) {
            case ActionTypes.LOAD_ALL_ASSETS:
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new Scene object
                        state = state.union(action.list);
                }
                return state;
            case ActionTypes.RECEIVE_SCENE:
                state = state.add(action.scene.img);
                return state;

            default:
                return state;
        }
        return state;
    }
}

export default new AssetsStore();