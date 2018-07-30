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
        console.log(currentScene);
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
                {L.WHEN} {L.PLAYER} {L[rule.event]} {chooseObj(object, rule, props)} {L.EX} {L[rule.action.type]} {L.TOWARDS} {rule.action.target}
            </p>
        );
    }));
}

function chooseObj(object, rule, props){

    return (
        <div className={"ruleObjSelection"}>
            <input list={'ruleObjSelection-'+rule.uid} defaultValue={object.name} />
            <datalist id={'ruleObjSelection-'+rule.uid}
                    onInput={ () => {
                        let e = document.getElementById('ruleObjSelection-'+rule.uid);
                        let selected = e.options[e.selectedIndex].value;
                        console.log(selected);
                        modifyRule(object, rule, selected , props)
                    }}>
                {[...props.interactiveObjects.values()].map((obj) => {
                    return (
                        <option key={obj.name} value={obj.name}>{obj.name}</option>
                    );
                })}
            </datalist>
        </div>
    );
}

function modifyRule(fstObject, rule, sndObjectName, props){
    console.log('onChange:');
    console.log(fstObject);
    console.log(rule);
    console.log(sndObjectName);
}

export default RulesCanvas;

/**/