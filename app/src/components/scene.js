import React from 'react';

function Scene(props){

    if(props.sceneName !== ""){
        return(
            <div className={'scene'}>
                <img id={'scene'}
                     src={"http://localhost:3000/media/" + props.sceneName}
                     alt={props.sceneName}
                     onClick={(event) => {
                         let p = getCoordinates(event);
                         props.clickScene(p.x, p.y);
                     }}
                />
            </div>
        );
    }

    return(
        <div className={'scene'}>
            <p>Seleziona una scena per iniziare</p>
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