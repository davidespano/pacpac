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

    if(currentScene != null) {
        //console.log(currentScene);
        if(currentScene.transitions.length === 0){
            return (<div>Non ci sono regole associate a questa scena</div>);
        }
        return ([...currentScene.transitions.values()].map((transition) => { return generateRule(transition, props)}));
    }
}

function generateRule(object, props){


    return ([...object.rules.values()].map((rule) => {
        return (
            <p className={'rules'} key={rule.uid}>
                {L.WHEN} {L.PLAYER} {L[rule.event]} {chooseObj(object, rule, props)} {L.EX} {generateActions(rule.action)}
            </p>
        );
    }));
}

function generateActions(actions){
    return ([...actions.values()].map((action) => {
        return (
            <p className="actions" key={action.uuid}>{L[action.type]} {L.TOWARDS} {action.target}</p>
        );
    }));
}

function chooseObj(object, rule, props){

    return (
        <div className={"ruleObjSelection"}>
            <input list={'ruleObjSelection-'+rule.uuid} defaultValue={object.name} />
            <datalist id={'ruleObjSelection-'+rule.uuid}>
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

export default RulesCanvas;

/**/