import React, { Component } from 'react';
import { EditorState, Modifier, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter} from 'draft-js-mention-plugin';
import scene_utils from "../../scene/scene_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Rules from "./Rules";
import CentralSceneStore from "../../data/CentralSceneStore"
import ScenesStore from "../../data/ScenesStore"
import ObjectsStore from "../../data/ObjectsStore"
import interface_utils from "./interface_utils";
import Actions from "../../actions/Actions";
import createMentionEntities from "./inizializeMention"
import {fromJS} from "immutable";
import forEach from 'lodash/forEach';
import 'draft-js-mention-plugin/lib/plugin.css';
import MentionsStore from "../../data/MentionsStore";
import EditorStateStore from "../../data/EditorStateStore";

const provaRaw = {
    blocks: [
        {
            text: 'QUANDO soggetto evento oggettoscena , ',
            type: 'quando-block',
            entityRanges: [
                {offset: 0, length: 7, key: 'quando'},
                {offset: 7, length: 9, key: 'soggetto'},
                {offset: 16, length: 7, key: 'evento'},
                {offset: 23, length: 13, key: 'oggettoScena'},
            ],
        },
        {
            text: 'SE oggetto operatore valore , ',
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
        se: {type: 'se', data: 'se'},
        allora: {type: 'allora', data: 'allora'},
        soggetto: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                        mention: {
                            name: 'soggetto',
                            type: 'soggetto',
                        }
                    }
        },
        evento: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'evento',
                    type: 'evento'
                }
            }},
        oggettoScena: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'oggettoScena',
                    type: 'oggettoScena'
                }
            }},
        oggetto: {type: 'mention', mutability: 'IMMUTABLE', data: {
                    mention: {
                        name: 'oggetto',
                        type: 'oggetto'
                    }
            }},
        operatore: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'operatore',
                    type: 'operatore'
                }
            }},
        valore: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'valore',
                    type: 'valore'
                }
            }},
        azione: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'azione',
                    type: 'azione'
                }
            }},
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

        forEach(provaRaw.entityMap, function(value, key) {
            if(value.data.mention)
                value.data.mention = fromJS(value.data.mention)
        });

        this.state = {
            editorState: EditorState.createWithContent(convertFromRaw(provaRaw)),
            suggestions: [],
            currentScene: CentralSceneStore.getState(),
            isMentioned: true,
            restoreState: EditorState.createWithContent(convertFromRaw(provaRaw))
        };

        this.mentionPlugin = createMentionPlugin();
        /*this.mentionPlugin = createMentionPlugin({

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
        });*/
    }

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSearchChange = ({ value }) => {
        this.updateSuggestions({value});
    };

    focus = () => {
        console.log(this.state.editorState)
        if(!this.state.isMentioned){
            let newState = EditorState.forceSelection(this.state.restoreState, this.state.editorState.getSelection());
            this.state.isMentioned = true;
            this.onChange(newState)
        }
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

    onAddMention = (mention) => {
        //TODO aggiungere il tipo sostituiendo 'quello che ti pare'
        this.state.isMentioned = true;
        const currunteContent = this.state.editorState.getCurrentContent();
        let newEntity = currunteContent.createEntity('mention', 'IMMUTABLE', {data: {
            mention: fromJS({
                name: mention.name,
                type: getMentionType(EditorStateStore.getState().get('mentionType'))
            })}});
        this.state.isMentioned = true;
    };

    updateSuggestions= ({ value }) => {

        console.log(value)

        let mentionsType = getMentionType(EditorStateStore.getState().get('mentionType'));

        if(mentionsType){
            let mentions = MentionsStore.getState().get(mentionsType);
            this.setState({
                suggestions: defaultSuggestionsFilter(value, mentions),
            });
        }
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
                        onAddMention={this.onAddMention}

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
        console.log(this.state.editorState)
        if(interface_utils.checkIfMultipleSelection(state)){ //SELECTION
            if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state) && interface_utils.isMention(state)
                /*&& interface_utils.checkIfEditableCursor(state)*/){ // editable
                //if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                console.log(selection)
                this.state.isMentioned=false;
                let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() + 2).set(
                    'focusOffset', selection.getStartOffset() + 2);
                let placeholder = '@' + input;

                let entity = interface_utils.getEntity(state);
                let entityType = null;
                if(entity.getData().mention.link === undefined){
                    entityType = entity.getData().mention.toJSON().type ;
                } else {
                    entityType = entity.getData().mention.type;
                }
                Actions.setMentionType(entityType);
                this.state.restoreState = this.state.editorState;
                let newContentState = Modifier.replaceText(
                    state.getCurrentContent(),
                    state.getSelection(),
                    placeholder,
                );

                let newState = EditorState.push(this.state.editorState, newContentState, 'replace-text');
                    newState = EditorState.forceSelection(newState, newSelectionState);
                    this.onChange(newState);
                    return 'handled';
                //}
            } else { // multiple blocks, multiple entities or keywords involved
                return 'handled';
            }
        } else { //CURSOR
            //TODO bloccare la scrittura fuori da entità, scritto cosi dopo l'inseriemnto della @ non potevo scrivere
            if(!interface_utils.checkIfEditableCursor(state)) { //not editable
                //return 'handled';
            } else {
                if(interface_utils.getEntity(state)){
                    let entity = interface_utils.getEntity(state);
                    let entityLenght;
                    if(entity.getData().mention.link === undefined){
                        entityLenght = entity.getData().mention.toJSON().name.length ;
                    } else {
                        entityLenght = entity.getData().mention.name.length ;
                    }
                    let startIndex = interface_utils.getStartIndexEntity(state)[0];
                    let selectionPosition = selection.getStartOffset();

                    let start = selectionPosition-startIndex;
                    let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() -(start)).set(
                        'focusOffset', selection.getStartOffset() + (entityLenght-start));

                    let selectState = EditorState.acceptSelection(state, newSelectionState);
                    let placeholder = '@' +input;

                    let entityType = null;
                    if(entity.getData().mention.link === undefined){
                        entityType = entity.getData().mention.toJSON().type ;
                    } else {
                        entityType = entity.getData().mention.type;
                    }
                    Actions.setMentionType(entityType);
                    this.state.restoreState = this.state.editorState;
                    this.state.isMentioned=false;
                    console.log(entityLenght);
                    let newContentState = Modifier.replaceText(
                        selectState.getCurrentContent(),
                        newSelectionState,
                        placeholder
                    );

                    let newSelectionState2 = selection.set('anchorOffset', selection.getStartOffset() - (start-2) ).set(
                        'focusOffset', selection.getStartOffset() - (start-2));
                    let newState = EditorState.push(this.state.editorState, newContentState, 'replace-text');
                    newState = EditorState.forceSelection(newState, newSelectionState2);
                    this.onChange(newState);
                    return 'handled';
                }

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

        if((command === 'backspace' || command === 'delete') && interface_utils.getEntity(state, -1) !== null ) {
            if(interface_utils.checkIfMultipleSelection(state)){ //SELECTION
                if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state) // deletable
                    /*&& interface_utils.checkIfEditableCursor(state)*/){

                    if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                        let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() + 1).set(
                            'focusOffset', selection.getStartOffset() + 1);

                        let placeholder = '@';

                        this.state.restoreState = this.state.editorState;
                        this.state.isMentioned=false;
                        //console.log('PLACEHOLDER');
                        let newContentState = Modifier.replaceText(
                            state.getCurrentContent(),
                            state.getSelection(),
                            placeholder,
                        );

                        let newState = EditorState.push(this.state.editorState, newContentState, 'replace-text');
                        newState = EditorState.forceSelection(newState, newSelectionState);
                        this.onChange(newState);
                        return 'handled';

                    }
                } else { // multiple blocks, multiple entities or keywords involved
                    console.log('KEYWORD');
                    return 'handled';
                }
                return 'handled';
            } else { //CURSOR
                if(interface_utils.checkAt(state)){
                    return 'handled';
                }
                if(interface_utils.checkIfDeletableCursor(state)){ // deletable
                    //console.log('NOT KEYWORD');
                    //if(interface_utils.checkIfPlaceholderNeeded(state)){ //placeholder
                    let entity = interface_utils.getEntity(state);
                    let entityLenght;
                    if(entity.getData().mention.link === undefined){
                        entityLenght = entity.getData().mention.toJSON().name.length ;
                    } else {
                        entityLenght = entity.getData().mention.name.length ;
                    }
                    let startIndex = interface_utils.getStartIndexEntity(state)[0];
                    let selectionPosition = selection.getStartOffset();

                    let start = selectionPosition-startIndex;
                    let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() -start).set(
                        'focusOffset', selection.getStartOffset() + (entityLenght-start));

                    let selectState = EditorState.acceptSelection(state, newSelectionState);
                    let placeholder = '@';

                    console.log(entityLenght);
                    this.state.restoreState = this.state.editorState;
                    this.state.isMentioned=false;
                    let newContentState = Modifier.replaceText(
                        selectState.getCurrentContent(),
                        newSelectionState,
                        placeholder
                    );

                    let newSelectionState2 = selection.set('anchorOffset', selection.getStartOffset() - (start-1) ).set(
                        'focusOffset', selection.getStartOffset() - (start-1));
                    let newState = EditorState.push(this.state.editorState, newContentState, 'replace-text');
                    newState = EditorState.forceSelection(newState, newSelectionState2);
                    this.onChange(newState);
                    return 'handled';
                    //}
                    //console.log('NO PLACEHOLDER');
                } else { // not deletable
                    //console.log('KEYWORD');
                    return 'handled';
                }
            }
        } else {
            if(interface_utils.checkAt(state)){
                return 'handled';
            }
        }
    }

}

function getMentionType(mentionType){

    console.log(mentionType)

    switch(mentionType){
        case 'soggetto': return 'subjects';
        case 'evento': return 'events';
        case 'oggettoScena': return 'objectsScene';
        case 'oggetto': return 'objects';
        case 'operatore': return 'operators';
        case 'valore': return 'values';
        case 'azione': return 'actions';
        default:
            return null;
    }
}