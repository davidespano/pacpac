import React from 'react';
import L from "../../utils/L";
import rules_utils from "../../interactives/rules/rules_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";

function Rules(props){
    return(
        <div id={'rules'} className={'rules'}>
            {generateRules(props.currentScene, props)}
        </div>
    );
}

function generateRules(currentScene, props){

    //check scene selection
    if(props.currentScene != null){
        //check if rules
        if(currentScene.get('rules').length === 0){
            return ("Non ci sono regole associate a questa scena");
        }

        //each rule
        return ([...currentScene.get('rules').values()].map((rule_uuid) => {
            let rule = props.rules.get(rule_uuid);

            /**TO DO : add objects selection here**/
            let object = "---"

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
                        <select id={'target'}
                                onChange={() => {
                                    let e = document.getElementById('target');
                                    let value = e.options[e.selectedIndex].text;
                                    let i = e.value;
                                    let r = rules_utils.setAction(rule, i, 'target', value); //returns updated rule
                                    props.updateRule(r); //send update to stores
                                    InteractiveObjectAPI.saveRule(props.currentScene, rule); //send update to db
                                }}>
                            <option key={"void_target"} value={index}>---</option>
                            {generateTargetOptions(props, action, index)}
                        </select>
                        <button class="remove-rule"></button>
                    </div>
                );
                })
            );
        }));
    }else {
        return "Nessuna scena selezionata";
    }
}

/**
 * Generates target options for transitions
 * @param props
 * @param action
 * @param index is the action index in actions array belonging to a Rule
 * @returns {any[]}
 */
function generateTargetOptions(props, action, index) {

    return ([...props.scenes.values()].map(child => {
        if(child.name !== props.currentScene.name) {
            if (child.name === action.target) {
                return (<option key={child.img + index} value={index} selected={"selected"}>{child.name}</option>)
            }
            else {
                return (<option key={child.img + index} value={index}>{child.name}</option>)
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

