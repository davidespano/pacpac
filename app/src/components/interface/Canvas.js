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
        //currentScene.transitions.forEach(transition => (generateTransitionRule(transition)));
    }
}

function generateTransitionRule(transition){
    return (
        <div className={'rules'}>
            Quando il giocatore seleziona
        </div>
    );
}



export default Canvas;