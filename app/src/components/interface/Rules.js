import React from 'react';
import L from "../../utils/L";
import rules_utils from "../../interactives/rules/rules_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";

function Rules(props){
    return(
        <div id={'rules'} className={'rules'}>
            {generateRules(props)}
        </div>
    );
}

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

            /**TO DO : add objects selection here**/
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
                            <img  className={"action-buttons"} src={"icons8-waste-50.png"} alt={'Cancella'}/>
                        </button>
                    </div>
                );
            }));
        }));
    }else {
        return "Nessuna scena selezionata";
    }
}

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
                        onChange={() => {
                            let e = document.getElementById('target' + action.uuid);
                            let value = e.options[e.selectedIndex].text;
                            let r = rules_utils.setAction(rule, index, 'target', value); //returns updated rule
                            props.updateRule(r); //send update to stores
                            InteractiveObjectAPI.saveRule(currentScene, r); //send update to db
                        }}>
                    <option key={"void_target"}>---</option>
                    {generateTargetOptions(props, action, index, currentScene.name)}
                </select>
            );
        case RuleActionTypes.FLIP_SWITCH:
            return(
                <select id={'change' + action.uuid}>
                    <option> Change to ON </option>
                    <option> Change to OFF </option>
                </select>
            );
            break;
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
            if (child.name === action.target) {
                return (<option key={child.img + index} selected={"selected"}>{child.name}</option>)
            }
            else {
                return (<option key={child.img + index} >{child.name}</option>)
            }
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

