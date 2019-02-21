import React, { Component } from 'react';
import { EditorState, Modifier, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import scene_utils from "../../scene/scene_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Rules from "./Rules";
import CentralSceneStore from "../../data/CentralSceneStore"
import ScenesStore from "../../data/ScenesStore"
import ObjectsStore from "../../data/ObjectsStore"
import interface_utils from "./interface_utils";
import Actions from "../../actions/Actions";

const provaRaw = {
    blocks: [
        {
            text: 'QUANDO soggetto evento oggetto-scena, ',
            type: 'quando-block',
            entityRanges: [
                {offset: 0, length: 7, key: 'quando'},
                {offset: 7, length: 9, key: 'soggetto'},
                {offset: 16, length: 7, key: 'evento'},
                {offset: 23, length: 14, key: 'oggettoScena'},
            ],
        },
        {
            text: 'SE oggetto operatore valore, ',
            type: 'se-block',
            entityRanges: [
                {offset: 0, length: 3, key: 'se'},
                {offset: 3, length: 8, key: 'oggetto'},
                {offset: 11, length: 10, key: 'operatore'},
                {offset: 21, length: 7, key: 'valore'},
            ],
        },
        {
            text: 'ALLORA azione ',
            type: 'allora-block',
            entityRanges: [
                {offset: 0, length: 7, key: 'allora'},
                {offset: 7, length: 7, key: 'azione'},
            ],
        }
    ],
    entityMap: {
        quando: {type: 'quando', data: 'quando'},
        soggetto: {type: 'soggetto', data: 'soggetto', mutability: 'MUTABLE'},
        evento: {type: 'evento', data: 'evento', mutability: 'MUTABLE'},
        oggettoScena: {type: 'oggettoScena', data: 'oggettoScena', mutability: 'MUTABLE'},
        se: {type: 'se', data: 'se'},
        oggetto: {type: 'oggetto', data: 'oggetto', mutability: 'MUTABLE'},
        operatore: {type: 'operatore', data: 'operatore', mutability: 'MUTABLE'},
        valore: {type: 'valore', data: 'valore', mutability: 'MUTABLE'},
        allora: {type: 'allora', data: 'allora'},
        azione: {type: 'azione', data: 'azione', mutability: 'MUTABLE'},
    },
};

const positionSuggestions = ({ state, props }) => {
    let transform;
    let transition;

    if (state.isActive && props.suggestions.length > 0) {
        transform = 'scaleY(1)';
        transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
    } else if (state.isActive) {
        transform = 'scaleY(0)';
        transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
    }

    return {
        transform,
        transition,
    };
};

const Entry = (props) => {
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        isFocused, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
            <div className={theme.mentionSuggestionsEntryContainer}>
                <div className={theme.mentionSuggestionsEntryContainerLeft}>
                    <img
                        src={mention.avatar}
                        className={theme.mentionSuggestionsEntryAvatar}
                        role="presentation"
                    />
                </div>

                <div className={theme.mentionSuggestionsEntryContainerRight}>
                    <div className={theme.mentionSuggestionsEntryText}>
                        {mention.name}
                    </div>

                    <div className={theme.mentionSuggestionsEntryTitle}>
                        {mention.title}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default class MentionRules extends Component {

    constructor(props) {
        super(props);


        this.state = {
            editorState: EditorState.createWithContent(convertFromRaw(provaRaw)),
            suggestions: [],
            currentScene: CentralSceneStore.getState()
        };

        this.mentionPlugin = createMentionPlugin({

            entityMutability: 'IMMUTABLE',
            theme: {
                editor: 'editor',
                mention: 'mention',
                mentionSuggestions: '',
                mentionSuggestionsEntry: 'mentionSuggestionsEntry',
                mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
                mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
                mentionSuggestionsEntryAvatar: 'mentionSuggestionsEntryAvatar',
                mentionSuggestionsEntryTitle: 'mentionSuggestionsEntryTitle',
                mentionSuggestionsEntryContainerRight: 'mentionSuggestionsEntryContainerRight',
                mentionSuggestionsEntryContainerLeft: 'mentionSuggestionsEntryContainerLeft',
                mentionSuggestionsEntryContainer: 'mentionSuggestionsEntryContainer'


            },
            positionSuggestions,
            mentionPrefix: '@',
            supportWhitespace: true
        });



    }


    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSearchChange = ({ value }) => {
        this.updateSuggestions(value);
    };



    focus = () => {
        this.editor.focus();
    };

    getImage(type){

        switch (type) {
            case InteractiveObjectsTypes.TRANSITION:
                return "icons/icons8-one-way-transition-100.png";
            case InteractiveObjectsTypes.SWITCH:
                return "icons/icons8-toggle-on-filled-100.png";
            default:
                return "?";
        }
    }

    openSuggestions = () => {
      this.updateSuggestions({value: ""});
    };

    updateSuggestions= ({ value }) =>{
        let scene = ScenesStore.getState().get(CentralSceneStore.getState());
        let allObjects = scene_utils.allObjects(scene);

        let data = allObjects.map(obj_uuid => {
            let obj = ObjectsStore.getState().get(obj_uuid);

            return {
                name: obj.name,
                link: '#',
                avatar: this.getImage(obj.type)
            };
        });


        this.setState({
            suggestions: data,
        });
    };

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];

        return (
            <div className={'rules'}>
                <div className={'editor'} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        handleBeforeInput={(input) => {
                            console.log('beforeInput');
                            return this.handleBeforeInput(input, this.state.editorState);
                        }}
                        handleKeyCommand={(command) => {
                            console.log('handleKeyCommand');
                            return this.handleKeyCommand(command, this.state.editorState);
                        }}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => { this.editor = element; }}
                    />
                    <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        onOpen={this.openSuggestions}
                        suggestions={this.state.suggestions}
                        entryComponent={Entry}
                    />
                </div>
            </div>
        );
    }


    /**
     * Checks if user is allowed to write in the selected portion of text
     * @param input
     * @returns {string}
     */
     handleBeforeInput(input, state){
        //const state = this.state.editorState;
        const selection = state.getSelection();

        if(interface_utils.checkIfMultipleSelection(state)){ //SELECTION
            if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state)
                && interface_utils.checkIfEditableCursor(state)){ // editable
                if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                    let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() +2).set(
                        'focusOffset', selection.getStartOffset() +2);

                    let placeholder = interface_utils.checkEndSpace() ? '@' + input : '@' + input + ' ';

                    let newContentState = Modifier.replaceText(
                        state.getCurrentContent(),
                        state.getSelection(),
                        placeholder,
                    );

                    let newState = EditorState.createWithContent(newContentState);
                    newState = EditorState.forceSelection(newState, newSelectionState);
                    this.setState(newState);
                    return 'handled';
                }
            } else { // multiple blocks, multiple entities or keywords involved
                return 'handled';
            }
        } else { //CURSOR
            if(!interface_utils.checkIfEditableCursor(state)) { //not editable
                return 'handled';
            }
        }
    }

    /**
     * Checks if the user is allowed to execute a command in the selected portion of text
     * @param command
     * @returns {string}
     */
     handleKeyCommand(command, state){
        const selection = state.getSelection();

        if(command === 'backspace' || command === 'delete') {
            if(interface_utils.checkIfMultipleSelection(state)){ //SELECTION
                if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state) // deletable
                    && interface_utils.checkIfEditableCursor(state)){

                    if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                        let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() +1).set(
                            'focusOffset', selection.getStartOffset() +1);

                        let placeholder = interface_utils.checkEndSpace() ? '@' : '@ ';

                        //console.log('PLACEHOLDER');
                        let newContentState = Modifier.replaceText(
                            state.getCurrentContent(),
                            state.getSelection(),
                            placeholder,
                        );

                        //Actions.updateRuleEditorFromContent(newContentState, newSelectionState);
                        let newState = EditorState.createWithContent(newContentState);
                        newState = EditorState.forceSelection(newState, newSelectionState);
                        this.setState(newState);
                        return 'handled';

                    }
                } else { // multiple blocks, multiple entities or keywords involved
                    console.log('KEYWORD');
                    return 'handled';
                }
            } else { //CURSOR
                if(interface_utils.checkIfDeletableCursor(state)){ // deletable
                    //console.log('NOT KEYWORD');
                    if(interface_utils.checkIfPlaceholderNeeded(state)){ //placeholder

                        let placeholder = interface_utils.checkEndSpace() ? '@' : '@ ';

                        //console.log('PLACEHOLDER');
                        let newContentState = Modifier.replaceText(
                            state.getCurrentContent(),
                            state.getSelection().set('anchorOffset', state.getSelection().getStartOffset() -1),
                            placeholder
                        );

                        let newState = EditorState.createWithContent(newContentState);
                        newState = EditorState.forceSelection(newState, state.getSelection());
                        this.setState(newState);
                        return 'handled';
                    }
                    //console.log('NO PLACEHOLDER');
                } else { // not deletable
                    //console.log('KEYWORD');
                    return 'handled';
                }
            }
        }
    }


}