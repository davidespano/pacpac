import React from 'react';
import L from "../../utils/L";

function RulesCanvas(props){
    return(
        <div id={'canvas'} className={'canvas'}>
            {generateRules(props.currentScene)}
        </div>
    );
}

function generateRules(currentScene){

    if(currentScene != null) {
        console.log(currentScene);
        if(currentScene.transitions.length === 0){
            return (<div>Non ci sono regole associate a questa scena</div>);
        }
        return ([...currentScene.transitions.values()].map((transition) => { return generateTransitionRule(transition)}));
    }
}

function generateTransitionRule(transition){

    return ([...transition.rules.values()].map((rule) => {
        return (
            <p className={'rules'}>
                {L.WHEN} {L.PLAYER} {L[rule.event]} {transition.name} {L.EX} {L[rule.action.type]} {L.TOWARDS} {rule.action.target}
            </p>
        );
    }));
}

export default RulesCanvas;

/**/