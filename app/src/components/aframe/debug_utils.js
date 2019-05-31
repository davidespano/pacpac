import 'aframe';
import './aframe_selectable'
import './pac-look-controls'
import './aframeUtils'
import React from 'react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import aframe_utils from "./aframe_utils";

async function generateNewAssets(sceneName) {
    let gameGraph = {};
    await SceneAPI.getAllDetailedScenes(gameGraph);

    let runState = {};
    Object.values(gameGraph.scenes).forEach(scene => {
        //create the state for the scene
        runState[scene.uuid] = {background: scene.img};
        //create the state for all the objs in the scene
        Object.values(scene.objects).flat().forEach(obj => {
            runState[obj.uuid] = {state: obj.properties.state}
        });
    });
    let scene = gameGraph['scenes'][sceneName.uuid];
    return aframe_utils.generateAsset(scene,
        runState[sceneName.uuid].background, runState);
}

async function generateNewBubble(sceneName, props) {
    let gameGraph = {};
    await SceneAPI.getAllDetailedScenes(gameGraph);

    let runState = {};
    Object.values(gameGraph.scenes).forEach(scene => {
        //create the state for the scene
        runState[scene.uuid] = {background: scene.img};
        //create the state for all the objs in the scene
        Object.values(scene.objects).flat().forEach(obj => {
            runState[obj.uuid] = {state: obj.properties.state}
        });
    });
    let scene = gameGraph['scenes'][sceneName.uuid];
    return (
        <Bubble key={"key" + scene.name} scene={scene} isActive={scene.name === props.scenes.get(props.currentScene).name}
                handler={(newActiveScene) => handleSceneChange(newActiveScene, props)} runState={runState}
                editMode={false} cameraChangeMode={(is3D) => cameraChangeMode(is3D)}
        />
    );
}

function cameraChangeMode(is3Dscene){
    let camera = document.getElementById('camera');
    let cursor = document.getElementById('cursor');
    let rayCastOrigin = is3Dscene?'cursor':'mouse';
    //TODO il controlli per il cambio camera vanno nella transizione
    //TODO verificare questo controllo, forse è fatto un po' a cazzo
    if(camera.getAttribute("pac-look-controls").pointerLockEnabled !== is3Dscene){
        camera.setAttribute("pac-look-controls", "planarScene: " + !is3Dscene);
        camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + is3Dscene);
        cursor.setAttribute('cursor', 'rayOrigin: ' + rayCastOrigin);
        document.querySelector('canvas').requestPointerLock();
        this.forceUpdate()
    } else {
        camera.setAttribute("pac-look-controls", "planarScene: " + is3Dscene);
        camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + !is3Dscene);
        cursor.setAttribute('cursor', 'rayOrigin: ' + rayCastOrigin);
        document.querySelector('canvas').requestPointerLock()
        this.forceUpdate()
    }

}

function handleSceneChange(newActiveScene, props) {
    props.updateCurrentScene(newActiveScene.uuid);
}


function loadNewScene(actualScene, targetScene) {

}

export default {
    generateNewAssets: generateNewAssets,
    generateNewBubble: generateNewBubble,
    loadNewScene: loadNewScene
}