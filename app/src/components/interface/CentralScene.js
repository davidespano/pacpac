import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";


const {mediaURL} = settings;

function CentralScene(props){
    let regex = RegExp('.*\.mp4$');
    let currentScene = null;

    if(props.currentScene){
        currentScene = props.scenes.get(props.currentScene);
    }

    if(currentScene !== null && !(regex.test(currentScene.img))){
        return(
            <div className={'scene'}>
                <img id={'central-img'}
                     src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + currentScene.img}
                     alt={currentScene.name}
                     onClick={(event) => {
                         let p = getCoordinates(event);
                         props.clickScene(p.x, p.y);
                     }}
                />
                <canvas id={'central-canvas'}></canvas>
            </div>
        );
    }
    if(currentScene !== null && (regex.test(currentScene.img))){
        return(
            <div className={'scene'}>
                <video muted preload={"metadata"} className={'video'} id={"video"} src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + currentScene.img}>
                </video>
                <canvas id={'central-canvas'}></canvas>
            </div>
        );
    }
    else {
        return (
            <div className={'scene'}>
                <img id={'scene'}
                     src={"blank.png"}
                     alt={'Seleziona una scena per iniziare'}
                />
            </div>
        );
    }
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