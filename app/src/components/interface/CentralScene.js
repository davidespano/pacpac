import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import scene_utils from "../../scene/scene_utils";


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
                <video muted={true}  playsInline controls className={'video'} id={"video"} src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + currentScene.img}>
                </video>
                {generateObjectsIcons(props)}
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

    let img = document.getElementById('central-img');

    return {
        x: event.pageX - img.offsetLeft,
        y: event.pageY - img.offsetTop,
    };
}

/**
 * Generates an icon for every object with a defined geometry
 * @param props
 * @returns {any[]}
 */
function generateObjectsIcons(props){

    console.log(props.centroids)

    let scene = props.scenes.get(props.currentScene);
    let allObjects = scene_utils.allObjects(scene);

    return (allObjects.map(obj_uuid => {

        if(!props.centroids.has(obj_uuid)) return;

        let obj = props.interactiveObjects.get(obj_uuid);

        return(
            <figure className={'icons'}
                    onClick={() => {
                        props.updateCurrentObject(obj);
                        props.rightbarSelection('objects');
                    }}
                    style={getPosition(props.centroids, obj.uuid)}
                    key={'icon-figure-' + obj.uuid}
            >
                <img className={'icons-img'}
                     id={'icon-' + obj.uuid}
                     src={getImage(obj.type)}
                     alt={obj.name}
                />
                <figcaption className={'icons-labels'}>{obj.name}</figcaption>
            </figure>
        );
    }));
}

/**
 * Returns icon position in percentage
 * @param centroids
 * @param obj
 * @returns {{left: string, top: string}}
 */
function getPosition(centroids, obj){
    const coord = centroids.get(obj);
    return {left: coord[0] + '%', top: coord[1] + '%'};
}

/**
 * Returns link to img according to the object type
 * @param type
 * @returns {string}
 */
function getImage(type){

    switch (type) {
        case InteractiveObjectsTypes.TRANSITION:
            return "icons/icons8-one-way-transition-100.png";
        case InteractiveObjectsTypes.SWITCH:
            return "icons/icons8-toggle-on-filled-100.png";
        case  InteractiveObjectsTypes.KEY:
            return "icons/icons8-key-100.png";
        case InteractiveObjectsTypes.LOCK:
            return "icons/icons8-lock-100.png";
        default:
            return "?";
    }
}

export default CentralScene;