import React, { Component } from 'react';
import { EditorState, Modifier, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
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
            text: 'SE oggetto operatore valore, ',
            type: 'se-block',
            entityRanges: [
                {offset: 0, length: 3, key: 'se'},
                {offset: 3, length: 7, key: 'oggetto'},
                {offset: 10, length: 10, key: 'operatore'},
                {offset: 20, length: 7, key: 'valore'},
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
                            type: 'quello che ti pare',
                        }
                    }
        },
        evento: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'evento',
                    type: 'quello che ti pare'
                }
            }},
        oggettoScena: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'oggettoScena',
                    type: 'quello che ti pare'
                }
            }},
        oggetto: {type: 'mention', mutability: 'IMMUTABLE', data: {
                    mention: {
                        name: 'oggetto',
                        type: 'quello che ti pare'
                    }
            }},
        operatore: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'operatore',
                    type: 'quello che ti pare'
                }
            }},
        valore: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'valore',
                    type: 'quello che ti pare'
                }
            }},
        azione: {type: 'mention',  mutability: 'IMMUTABLE', data: {
                mention: {
                    name: 'azione',
                    type: 'quello che ti pare'
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
            isMentioned: false,
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

    onAddMention = (mention) => {
        this.state.isMentioned = true;
        const currunteContent = this.state.editorState.getCurrentContent();
        let newEntity = currunteContent.createEntity('mention', 'IMMUTABLE', {data: {
            mention: fromJS({
                name: mention.name,
                type: 'quello che ti pare'
            })}});
        this.state.isMentioned = true;
    };

    updateSuggestions= ({ value }) =>{
        let scene = ScenesStore.getState().get(CentralSceneStore.getState());
        let allObjects = scene_utils.allObjects(scene);

        let data = allObjects.map(obj_uuid => {
            let obj = ObjectsStore.getState().get(obj_uuid);

            return {
                avatar: this.getImage(obj.type),
                link: '#',
                name: obj.name

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
        console.log(convertToRaw(this.state.editorState.getCurrentContent()))
        console.log(this.state.editorState.getCurrentContent())
        if(interface_utils.checkIfMultipleSelection(state)){ //SELECTION
            if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state) && interface_utils.isMention(state)
                /*&& interface_utils.checkIfEditableCursor(state)*/){ // editable
                //if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                console.log(selection)
                    let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() + 2).set(
                        'focusOffset', selection.getStartOffset() + 2);
                    let placeholder = '@' + input;

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
            //TODO bisogna rivedere il check, trovare un sistema per selezionare il testo e inserire la chiocciola
            /*if(!interface_utils.checkIfEditableCursor(state)) { //not editable
                return 'handled';
            } else {
                let entity = interface_utils.getEntity(state);
                let entityLenght = entity.getData().mention.toJSON().name.length;
                console.log(selection.getAnchorKey())
                let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() - entityLenght);
                let placeholder = '@' + input;

                let newContentState = Modifier.replaceText(
                    state.getCurrentContent(),
                    state.getSelection(),
                    placeholder,
                );

                let newState = EditorState.createWithContent(newContentState);
                //newState = EditorState.forceSelection(newState, newSelectionState);
                this.onChange(newState);
                return 'handled';
            }*/
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
                /*if(interface_utils.checkBlock(state) && interface_utils.checkEntity(state) // deletable
                    && interface_utils.checkIfEditableCursor(state)){

                    if(!(interface_utils.firstCheck(state) || interface_utils.secondCheck(state))){ // replace with placeholder

                        let newSelectionState = selection.set('anchorOffset', selection.getStartOffset() + 1).set(
                            'focusOffset', selection.getStartOffset() + 1);;

                        let placeholder = '@';

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
                }*/
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