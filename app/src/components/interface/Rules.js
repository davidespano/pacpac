import React from 'react';
import rules_utils from "../../interactives/rules/rules_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import {Editor, EditorState, convertToRaw, convertFromRaw, RichUtils, Modifier} from "draft-js";
import createMentionPlugin from 'draft-js-mention-plugin';
import interface_utils from "./interface_utils";


function Rules(props){

    /*return(
        <div id={'rules'} className={'rules'}>
            <Editor editorState={props.rulesEditor.editorState}
                    handleBeforeInput={(input) => {
                        console.log('beforeInput');
                        return handleBeforeInput(input, props);
                    }}
                    handleKeyCommand={(command) => {
                        console.log('handleKeyCommand');
                        return handleKeyCommand(command, props);
                    }}
                    onChange={(state) => {
                        console.log('onchange');
                        props.updateRuleEditorFromState(state);
                    }}/>
        </div>
    );*/
}

/**
 * Checks if user is allowed to write in the selected portion of text
 * @param input
 * @param props
 * @returns {string}
 */
function handleBeforeInput(input, props){
    const state = props.rulesEditor.editorState;
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

                props.updateRuleEditorFromContent(newContentState, newSelectionState);
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
 * @param props
 * @returns {string}
 */
function handleKeyCommand(command, props){
    const state = props.rulesEditor.editorState;
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

                    props.updateRuleEditorFromContent(newContentState, newSelectionState);
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

                    props.updateRuleEditorFromContent(newContentState, state.getSelection());
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

/**
 * check selected entity
 * @param props
 * @param offset (move selection n spaces to the left, default 0)
 * @returns {boolean}
 */
function checkIfEditable(props, offset = 0){
    let entity = interface_utils.getEntity(props.rulesEditor.editorState, offset);
    console.log('ENTITY: ' + entity);

    return entity !== null && entity.getType() !== 'quando' && entity.getType() !== 'se' && entity.getType() !== 'allora';
}

/*<MentionsSuggestions suggestions={props.rulesEditor.suggestions}
                                 onSearchChange={(state) => props.updateSuggestion(state)}
            />*/

/*
function generateRules(props){

    //check scene selection
    if(props.currentScene != null){
        //get current scene
        let currentScene = props.scenes.get(props.currentScene);
        //check rules
        if(currentScene.get('rules').length === 0){
            return ("Non ci sono regole associate a questa scena");
        }
        //each rule
        return ([...currentScene.get('rules').values()].map((rule_uuid) => {
            let rule = props.rules.get(rule_uuid);

            let object = "---";

            if(props.interactiveObjects.has(rule.object_uuid)){
                object = props.interactiveObjects.get(rule.object_uuid).name;
            }
            let index = -1;

            //each action in rule
            return([...rule.get('actions').values()].map(action => {
                index++; //action index in array
                return (
                    <div className={'single-action'} key={rule.uuid + index}>
                        {rule.event} {object}:
                        {generateAction(index, rule, action, props, currentScene)}
                        <button
                            title={"Cancella"}
                            className={"action-buttons-container"}
                            onClick={() => {
                                InteractiveObjectAPI.removeRule(currentScene, rule);
                            }}>
                            <img  className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella'}/>
                        </button>
                    </div>
                );
            }));
        }));
    }else {
        return "Nessuna scena selezionata";
    }
}*/

/**
 * Generate html for the given action
 * @param index of the action
 * @param rule the action belongs to
 * @param action
 * @param props
 * @param currentScene
 */
function generateAction(index, rule, action, props, currentScene){
    switch(action.type){
        case RuleActionTypes.TRANSITION:
            return(
                <select id={'target' + action.uuid}
                        defaultValue={action.target}
                        onChange={() => {
                            let e = document.getElementById('target' + action.uuid);
                            let value = e.options[e.selectedIndex].text;
                            let r = rules_utils.setAction(rule, index, 'target', value); //returns updated rule
                            props.updateRule(r); //send update to stores
                            InteractiveObjectAPI.saveRule(currentScene, r); //send update to db
                        }}
                >
                    <option key={"void_target"} value={'---'}>---</option>
                    {generateTargetOptions(props, action, index, currentScene.name)}
                </select>
            );
        case RuleActionTypes.FLIP_SWITCH:
        case RuleActionTypes.ON:
        case RuleActionTypes.OFF:
            return(
                <select id={'change' + action.uuid}
                        defaultValue={action.type}
                        onChange={() => {
                            let e = document.getElementById('change' + action.uuid);
                            let value = e.options[e.selectedIndex].value;
                            let r = rules_utils.setAction(rule, index, 'type', value); //returns updated rule
                            props.updateRule(r); //send update to stores
                            InteractiveObjectAPI.saveRule(currentScene, r); //send update to db
                        }}
                >
                    <option value={RuleActionTypes.ON}> Porta ad ON </option>
                    <option value={RuleActionTypes.OFF}> Porta ad OFF </option>
                    <option value={RuleActionTypes.FLIP_SWITCH}> Inverti lo stato</option>
                </select>
            );
        default:
            return;
    }
}

/**
 * Generates target options for transitions
 * @param props
 * @param action
 * @param index is the action index in actions array belonging to a Rule
 * @param name is the name of the currently selected scene
 * @returns {any[]}
 */
function generateTargetOptions(props, action, index, name) {

    return ([...props.scenes.values()].map(child => {
        if(child.name !== name) {
            return (<option key={child.img} value={child.name}>{child.name}</option>)
        }
    }));
}

/*function chooseObj(object, rule, props){
    let id="ruleObjSelection";
    let dataListId=id+"-"+rule.uuid;
    let v = props.datalists.get(rule.uuid);
    return (
        <div className={id}>
            <input
                   id={id}
                   list={dataListId}
                   value={v}
                   onKeyDown={(event) => handleKeys(event,v,rule.uuid,object.uuid,props)}
            />
            <datalist id={dataListId}>
                <select>
                {[...props.interactiveObjects.values()].map((obj) => {
                    return (
                        <option key={obj.uuid} value={obj.name}>{obj.name}</option>
                    );
                })}
                </select>
            </datalist>
        </div>
    );
}


function handleKeys(event,value,ruleId,objectId,props) {

    if(event.key.length === 1)
        value = value + event.key;
    else {
        switch (event.key) {
            case 'Backspace':
                if(value.length >= 1)
                    value = value.slice(0,-1);
                break;
            default:
                break;
        }
    }
    props.updateDatalist(ruleId,value);
}*/

export default Rules;