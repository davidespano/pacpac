import React from 'react';
import settings from '../../utils/settings';

const {mediaURL} = settings;

function CentralScene(props){

    if(props.currentScene !== null){
        return(
            <div className={'scene'}>
                <img id={'scene'}
                     src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + props.currentScene.img}
                     alt={props.currentScene.name}
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

    let img = document.getElementById('scene');

    return {
        x: event.pageX - img.offsetLeft,
        y: event.pageY - img.offsetTop,
    };
}

export default CentralScene;

//props.clickScene(getCoordinates(event).x, getCoordinates(event).y)