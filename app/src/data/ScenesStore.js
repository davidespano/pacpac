import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import LeftbarElement from "./LeftbarElement";
import MyScene from "../scene/MyScene";

class ScenesStore extends ReduceStore {

    constructor() {
        super(AppDispatcher);
    }

    getInitialState() {
        return Immutable.Set();
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.LOAD_ALL_SCENES:
                // if state isn't undefined
                if(state) {
                    // for each scene in db create new MyScene object
                    action.response.forEach(function(scene){
                        state = state.add(new MyScene(
                            scene.name,
                            [], //transition list
                            scene.tagName,
                            scene.tagColor,
                        ));
                    });
                }
                return state;
            case ActionTypes.GET_SCENE_RESPONSE:
                return state.add(action.scene);
            default:
                return state;
        }
    }
}

export default new ScenesStore();
