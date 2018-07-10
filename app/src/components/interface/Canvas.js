import React from 'react';

function Canvas(props){
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
        currentScene.transitions.forEach(transition => (canvas.appendChild(generateTransitionRule(transition))));
    }

}

function generateTransitionRule(transition){
    let r = document.createElement('p');
    r.class = 'rules';
    r.innerHTML = 'Nuova transizione:' + transition.name;
    return r;
}

function cleanCanvas(){
    let canvas = document.getElementById('canvas');
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}

export default Canvas;