import React from 'react';
import L from "../../utils/L";

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
        return ([...currentScene.get('rules').values()].map((rule) => {
            let object = props.interactiveObjects.get(rule.object_uuid).name;
            let index = -1;
            //each action in rule
            return([...rule.get('actions').values()].map(action => {
                index++;
                return (
                    <div className={'single-action'} key={rule.uuid + index}>
                        {rule.event} {object}:
                        <select>
                            <option key={"void_target"}>---</option>
                            {generateTargetOptions(props, action)}
                        </select>
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
 * @returns {any[]}
 */
function generateTargetOptions(props, action) {

    return ([...props.scenes.values()].map(child => {
        if(child.name !== props.currentScene.name) {
            if (child.img === action.target) {
                return (<option key={child.img + "target"} selected={"selected"}>{child.name}</option>)
            }
            else {
                return (<option key={child.img + "target"}>{child.name}</option>)
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

