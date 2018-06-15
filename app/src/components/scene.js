import React from 'react';

function Scene(props){
    return(
        <div className={'scene'}>
            <img id={'scene'}
                 src={"./Image360/"+props.sceneName}
                 alt={props.sceneName}
                 onClick={(event) => {
                     var p = getCoordinates(event);
                     props.clickScene(p.x, p.y);
                 }}
            />
        </div>
    );
}

function getCoordinates(event){

    var img = document.getElementById('scene');

    return {
        x: event.pageX - img.offsetLeft,
        y: event.pageY - img.offsetTop,
    };
}

export default Scene;

//props.clickScene(getCoordinates(event).x, getCoordinates(event).y)