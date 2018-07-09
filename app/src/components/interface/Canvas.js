import React from 'react';

function Canvas(props){
    return(
        <div id={'canvas'} className={'canvas'}>
            {[...props.currentScene.transitions.values()].map( element  => (
                generateTransitionRule(element);
            ))}
        </div>
    );
}

function generateTransitionRule(obj){
    
}



export default Canvas;