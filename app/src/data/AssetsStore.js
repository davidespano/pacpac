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
        let a, asset;

        switch (action.type) {
            case ActionTypes.LOAD_ALL_ASSETS:
                // if state isn't undefined
                if(state) {
                    action.list.forEach(a => {
                        asset = Asset({
                            name: a.path,
                            uuid: a.path,
                            width: a.width,
                            height: a.height,
                            type: stores_utils.getFileType(a.path),
                        });
                        state = state.set(asset.uuid, asset);
                    })
                }
                return state;
            case ActionTypes.RESET:
                return Immutable.Map();
            default:
                return state;
        }
        return state;
    }
}

export default new AssetsStore();