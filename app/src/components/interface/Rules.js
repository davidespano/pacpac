import React from 'react';
import rules_utils from "../../interactives/rules/rules_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import {Editor, EditorState, convertToRaw, convertFromRaw, RichUtils} from "draft-js";
import createMentionPlugin from 'draft-js-mention-plugin';
import stores_utils from "../../data/stores_utils";

//const mentionPlugin = createMentionPlugin();

//const { MentionsSuggestions } = mentionPlugin ;
//const plugins = [mentionPlugin];



function Rules(props){

    return(
        <div id={'rules'} className={'rules'}>
            <Editor editorState={props.rulesEditor.editorState}
                    handleBeforeInput={() => {
                        console.log('beforeInput');
                        handleBeforeInput(props);
                    }}
                    handleKeyCommand={(command) => {
                        console.log('handleKeyCommand');
                        handleKeyCommand(command, props);
                    }}
                    onChange={(state) => {
                        console.log('onchange');
                        props.updateRuleEditorFromState(state);
                    }}/>
        </div>
    );
}

/**
 * Checks if user is allowed to write in the selected portion of text
 * @param props
 * @returns {string}
 */
function handleBeforeInput(props){
    let entity = stores_utils.getEntity(props.rulesEditor.editorState);
    if(entity){
        switch(entity.getType()){
            case 'quando':
            case 'se':
            case 'allora':
                props.updateRuleEditorFromState(props.rulesEditor.editorState);
                return 'handled';
            default:
                break;
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
    if(command === 'backspace'){
        let entity = stores_utils.getEntity(props.rulesEditor.editorState);
        console.log('ENTITY: ' + entity);

        if(entity){
            switch(entity.getType()){
                case 'quando':
                case 'se':
                case 'allora':
                    return 'handled';
                default:
                    break;
            }
        } else {
            return 'handled';
        }
    }
}


function checkBlocks(state, props){
    let raw = convertToRaw(state.getCurrentContent());
    //let checker = true;

    raw.blocks.forEach( block => {

        console.log('ENTITYMAP:');
        console.log(raw.entityMap);

        if(block.entityRanges.length !== 0) {
            console.log(block.entityRanges.length)
            let length = block.entityRanges[0].length;
            let sliced = block.text.slice(0, length);
            let key = block.entityRanges[0].key;
            let type = raw.entityMap[key].type;

            //checker = checker && (sliced === type || sliced === type.toUpperCase());

            console.log('SLICED: ' + sliced);
            console.log('TYPE:' + type);


            if(!(sliced === type || sliced === type.toUpperCase())){
                props.updateRuleEditorFromState(EditorState.undo(props.rulesEditor.editorState));
            }

        } else {
            props.updateRuleEditorFromState(EditorState.undo(props.rulesEditor.editorState));
        }

    });
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

