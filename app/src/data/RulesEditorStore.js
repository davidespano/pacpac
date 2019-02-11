import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import {EditorState, ContentState, convertFromHTML} from 'draft-js';
import ActionTypes from "../actions/ActionTypes";


class RulesEditorStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return EditorState.createEmpty();
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.UPDATE_RULE_EDITOR_STATE:
                return action.state;
            case ActionTypes.UPDATE_RULE_EDITOR_HTML:
                let blocks = convertFromHTML(action.text);

                state = ContentState.createFromBlockArray(
                    blocks.contentBlocks,
                    blocks.entityMap,
                );

                return EditorState.createWithContent(state);
            default:
                return state;
        }
    }
}

export default new RulesEditorStore();