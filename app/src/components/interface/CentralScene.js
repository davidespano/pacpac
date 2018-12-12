import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import Canvas from "./Canvas";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";


const {mediaURL} = settings;

function CentralScene(props){
    let regex = RegExp('.*\.mp4$');
    let currentScene = null;

    if(props.currentScene){
        currentScene = props.scenes.get(props.currentScene);
    }

    if(currentScene !== null && !(regex.test(currentScene.img))){
        return(
            <div id={'central-scene'} className={'scene'}>
                <img id={'central-img'}
                     src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + currentScene.img}
                     alt={currentScene.name}
                     onClick={(event) => {
                         let p = getCoordinates(event);
                         props.clickScene(p.x, p.y);
                     }}
                />
                {generateObjectsIcons(props)}
            </div>
        );
    }
    if(currentScene !== null && (regex.test(currentScene.img))){
        return(
            <div id={'central-scene'} className={'scene'}>
                <video muted preload={"metadata"} className={'video'} id={"video"} src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + currentScene.img}>
                </video>
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

/**
 * Returns coordinates of clicked point
 * @param event
 * @returns {{x: number, y: number}}
 */
function getCoordinates(event){

    let img = document.getElementById('scene');

    return {
        x: event.pageX - img.offsetLeft,
        y: event.pageY - img.offsetTop,
    };
}

function generateObjectsIcons(props){
    const img = document.getElementById('central-img');

    if(img){

        console.log(img);
        let width = img.offsetWidth;
        let height = img.offsetHeight;

        let scene = props.scenes.get(props.currentScene);
        let objects = scene.objects;
        let allObjects = objects.transitions.concat(objects.switches);

        if(allObjects.length === 0) return;

        return (allObjects.map(obj_uuid => {
            console.log(obj_uuid)

            if(!props.centroids.has(obj_uuid)) return;

            console.log('ciauuu')

            let obj = props.interactiveObjects.get(obj_uuid);
            let link;

            switch (obj.type) {
                case InteractiveObjectsTypes.TRANSITION:
                    link = "icons/icons8-one-way-transition-100.png";
                    break;
                case InteractiveObjectsTypes.SWITCH:
                    link = "icons/icons8-toggle-on-filled-100.png";
                    break;
                default:
                    return;
            }

            return(
                <figure className={'icons'}
                        onClick={() => {
                            props.updateCurrentObject(obj.uuid);
                            props.rightbarSelection('objects');
                        }}
                        style={calculatePosition(props, obj, width, height)}
                        key={'icon-figure-' + obj.uuid}
                >
                    <img className={'icons-img'}
                         id={'icon-' + obj.uuid}
                         src={link}
                         alt={obj.name}
                    />
                    <figcaption className={'icons-labels'}>{obj.name}</figcaption>
                </figure>
            );
        }));
    }
}

function calculatePosition(props, obj, width, height){
    const coord = props.centroids.get(obj.uuid);

    let x = coord[0] * width / 360;
    let y = coord[1] * height / 360;

    x = x < 25 ? x : (x - 25);
    y = y < 25 ? y : (y - 25);

    return({left: x, top: y});
}

export default CentralScene;

//props.clickScene(getCoordinates(event).x, getCoordinates(event).y)