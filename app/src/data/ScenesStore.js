import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';
import LeftbarElement from "./LeftbarElement";

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
                    action.response.forEach(function(scene){
                        let img = scene.name;
                        let name = scene.name.replace(/\.[^/.]+$/, "");

                        //console.log(name + ": " + img);

                        state = state.add(new LeftbarElement({
                                name: name,
                                img: img,
                            })
                        );
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
