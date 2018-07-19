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
        cleanCanvas();
        let canvas = document.getElementById('canvas');
        currentScene.transitions.forEach(transition => ((generateTransitionRule(canvas, transition))));
    }

}

function generateTransitionRule(canvas, transition){

    transition.rules.forEach((rule) => {
        console.log(rule)
        let r = document.createElement('p');
        r.class = 'rules';
        //r.innerHTML = 'Nuova transizione:' + transition.name;
        r.innerHTML = L.WHEN + ' ' + L.PLAYER + ' ' + L[rule.event] + ' ' + transition.name + ' ' + L.EX + ' ' +
                      L[rule.action.type] + ' ' + L.TOWARDS + ' ' + rule.action.target;
        canvas.appendChild(r);
    });
}

function cleanCanvas(){
    let canvas = document.getElementById('canvas');
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}

export default RulesCanvas;