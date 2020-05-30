import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";
import Values from "../../rules/Values";


const {mediaURL} = settings;

function CentralScene(props){
    let regex = RegExp('.*\.mp4$|.MOV$');

    let currentScene = null;
    let path =`${mediaURL}${window.localStorage.getItem("gameID")}/`;
    let sceneRendering = null;

    if(props.currentScene){
        currentScene = props.scenes.get(props.currentScene);
    }

    if(currentScene !== null){
        let src = path + '_thumbnails_/' + currentScene.img + (regex.test(currentScene.img)? ".png" : "");
        if(currentScene.type === Values.TWO_DIM){

        }
        return(
            <div id={'central-scene'} className={'scene'}>
                <img id={'central-img'}
                     src={src}
                     alt={currentScene.name}
                     onClick={(event) => {
                         let p = getCoordinates(event);
                         props.clickScene(p.x, p.y);
                     }}
                />
                {generateObjectsIcons(props)}
            </div>
        );
    } else {
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

    //console.log(props.centroids)

    let scene = props.scenes.get(props.currentScene);
    let allObjects = scene_utils.allObjects(scene);

    return (allObjects.map(obj_uuid => {


        let obj = props.interactiveObjects.get(obj_uuid);

        //se è un oggetto globale uso il css con il background scuro, altrimenti quello di default
        let img = (obj.type === InteractiveObjectsTypes.PLAYTIME || obj.type === InteractiveObjectsTypes.HEALTH ||
            obj.type === InteractiveObjectsTypes.SCORE) ? "icons-global-img" : "icons-img";
        let objStyle = null;
        switch (obj.type) {
            case InteractiveObjectsTypes.PLAYTIME:
                objStyle = {left: "97%" , top: "7.5%"};
                break;
            case InteractiveObjectsTypes.HEALTH:
                objStyle = {left: "3%" , top: "7.5%"};
                break;
            case InteractiveObjectsTypes.SCORE:
                objStyle = {left: "9%" , top: "7.5%"};
                break;
            case InteractiveObjectsTypes.TEXTBOX:
                objStyle = {left: "50%" , bottom: "1%"};
                break;
            case InteractiveObjectsTypes.TIMER:
                objStyle = {left: "50%" , top: "7.5%"};
                break;
            default:
                if(!props.centroids.has(obj_uuid)) return;
                objStyle = getPosition(props.centroids, obj.uuid);
        }

        return(
            <figure className={'icons'}
                    onClick={() => {
                        props.updateCurrentObject(obj);
                        props.rightbarSelection('objects');
                    }}
                    style={objStyle}
                    key={'icon-figure-' + obj.uuid}
            >
                <img className={img}
                     id={'icon-' + obj.uuid}
                     src={interface_utils.getObjImg(obj.type)}
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

export default CentralScene;