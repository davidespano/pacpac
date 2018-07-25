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
        //return (currentScene.transitions.forEach(transition => ((generateTransitionRule(canvas, transition)))));
    }
}

function generateTransitionRule(canvas, transition){

    return (
        transition.rules.forEach((rule) => {
            return (
                <p className={'rules'}>
                    {L.WHEN + ' ' + L.PLAYER + ' ' + L[rule.event] + ' ' + transition.name + ' ' + L.EX + ' ' +
                    L[rule.action.type] + ' ' + L.TOWARDS + ' ' + rule.action.target}
                </p>
            );
        })
    );
}

function cleanCanvas(){
    let canvas = document.getElementById('canvas');
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}

export default RulesCanvas;