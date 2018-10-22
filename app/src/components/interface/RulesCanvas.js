import React from 'react';
import L from "../../utils/L";

function RulesCanvas(props){
    return(
        <div id={'canvas'} className={'canvas'}>
            {generateRules(props.currentScene, props)}
        </div>
    );
}

function generateRules(currentScene, props){

    /*

    if(currentScene != null) {
        //console.log(currentScene);
        if(currentScene.objects.transitions.length === 0){
            return (<div>Non ci sono regole associate a questa scena</div>);
        }
        return ([...currentScene.objects.transitions.values()].map((transition) => { return generateRule(transition, props)}));
    } else {
        return (<div>Nessuna scena selezionata</div>);
    }
    */
}

function generateRule(object, props){

    return ([...object.rules.values()].map((rule) => {
        return (
            <p className={'rules'} key={rule.uuid}>
                {L.WHEN} {L.PLAYER} {L[rule.event]} {object.name} {L.EX} {generateActions(rule.actions)}
            </p>
        );
    }));
}

function generateActions(actions){
    if(actions){
        return ([...actions.values()].map((action) => {
            return (
               L[action.type] + " " +  L.TOWARDS + " " + action.target.replace(/\.[^/.]+$/, "")
            );
        }));
    } else{
        return "...";
    }
}

function chooseObj(object, rule, props){
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

function modifyRule(fstObject, rule, sndObjectName, props){

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
   /* if(props.interactiveObjects.has(objectId)){

    }*/
}

export default RulesCanvas;

