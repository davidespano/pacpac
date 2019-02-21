import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';
import {EditorState, ContentState, convertFromHTML, convertFromRaw} from 'draft-js';
import ActionTypes from "../actions/ActionTypes";
import Mentions from "./Mentions";
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import storeUtils from "./stores_utils";


class RulesEditorStore extends ReduceStore {

    constructor(){
        super(AppDispatcher);
    }

    getInitialState(){
        return {
            editorState: EditorState.createEmpty(),
            suggestions: Mentions,
            mentionsPlugin: createMentionPlugin(),
        }
    }

    reduce(state, action){
        switch(action.type){
            case ActionTypes.UPDATE_CURRENT_SCENE:
                return {
                    editorState: EditorState.createWithContent(convertFromRaw(
                        storeUtils.generateRawFromRules(action.rules, action.objectMap))),
                    suggestions: state.suggestions,
                    mentionsPlugin: state.mentionsPlugin,
                };
            case ActionTypes.UPDATE_RULE_EDITOR_STATE:
                return {
                    editorState: action.state,
                    suggestions: state.suggestions,
                    mentionsPlugin: state.mentionsPlugin,
                };
            case ActionTypes.UPDATE_RULE_EDITOR_CONTENT:

                let newState = EditorState.createWithContent(action.content);
                newState = EditorState.forceSelection(newState, action.selection);

                return {
                    editorState: newState,
                    suggestions: state.suggestions,
                    mentionsPlugin: state.mentionsPlugin,
                };
            case ActionTypes.UPDATE_RULE_EDITOR_RAW:

                /*let blocks = convertFromHTML(action.text);

                state = ContentState.createFromBlockArray(
                    blocks.contentBlocks,
                    blocks.entityMap,
                );*/

                return {
                    editorState: EditorState.createWithContent(convertFromRaw(action.raw)),
                    suggestions: state.suggestions,
                    mentionsPlugin: state.mentionsPlugin,
                };
            default:
                return state;
        }
    }
}

export default new RulesEditorStore();