import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
import {Howl} from 'howler';
import store_utils from '../../data/stores_utils'
import AudioManager from './AudioManager'
import Values from '../../interactives/rules/Values';
const THREE = require('three');
const {mediaURL} = settings;
const soundsHub = require('./soundsHub');

function executeAction(VRScene, rule, action){
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let actual_scene = VRScene.state.activeScene.name;
    let actual_sceneimg = VRScene.state.activeScene.img;
    let current_object = {};
    let game_graph = VRScene.state.graph;
    let sceneName = action.subj_uuid;
    let media = action.obj_uuid;
    let cursor = document.querySelector('#cursor');
    Object.values(state.activeScene.objects).flat().forEach(o =>{
        if(o.uuid === rule.event.obj_uuid){
            current_object = o;

        }
    });

    switch (action.action) {
        case RuleActionTypes.TRANSITION:
            let duration_transition = 0;
            let duration = current_object.properties.duration ? current_object.properties.duration : 0;
            let objectVideo_transition = 0;
            cursor.setAttribute('material', 'visible: false');
            cursor.setAttribute('raycaster', 'far: 0.1');
            if(current_object.type === 'TRANSITION'){
                objectVideo_transition = document.querySelector('#media_' + current_object.uuid);
                if(objectVideo_transition != null && objectVideo_transition.nodeName === 'VIDEO') {
                    objectVideo_transition.play();
                    duration_transition = (objectVideo_transition.duration * 1000);
                }
            }
            setTimeout(function () {
                if(objectVideo_transition !== 0 && objectVideo_transition !== null &&
                    (store_utils.getFileType(objectVideo_transition.img) === 'video')) objectVideo_transition.pause();
                // se le due scene sono dello stesso tipo le gestisco allo stesso modo
                if(VRScene.state.activeScene.type === Values.THREE_DIM && state.graph.scenes[media].type === Values.THREE_DIM ||
                   VRScene.state.activeScene.type === Values.TWO_DIM && state.graph.scenes[media].type === Values.TWO_DIM)
                    transition(state.activeScene, state.graph.scenes[media], duration);
                else
                    transition2D(state.activeScene, state.graph.scenes[media], duration, VRScene)
            },duration_transition);

            break;
        case RuleActionTypes.FLIP_SWITCH:
            let duration_switch = 0;
            let switchVideo = document.getElementById('media_'+current_object.uuid);

            if(switchVideo != null) {
                cursor.setAttribute('material', 'visible: false');
                cursor.setAttribute('raycaster', 'far: 0.1');
                if(store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
                duration_switch = (switchVideo.duration * 1000);
            }
            setTimeout(function () {
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'visible: true');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');
                if(runState[current_object.uuid].state === "OFF")
                    runState[current_object.uuid].state = "ON";
                else
                    runState[current_object.uuid].state = "OFF";

                VRScene.setState({runState: runState});
            },duration_switch);

            break;
        case RuleActionTypes.ON:
            if(runState[current_object.uuid].state === "OFF"){
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_'+current_object.uuid);

                if(switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if(store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }
                setTimeout(function () {
                    cursor.setAttribute('raycaster', 'far: 10000');
                    cursor.setAttribute('material', 'visible: true');
                    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                    cursor.setAttribute('color', 'black');
                    runState[current_object.uuid].state = "ON";
                    VRScene.setState({runState: runState});
                },duration_switch);

            }
            break;
        case RuleActionTypes.OFF:
            if(runState[current_object.uuid].state === "ON"){
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_'+current_object.uuid);

                if(switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if(store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }
                setTimeout(function () {
                    cursor.setAttribute('raycaster', 'far: 10000');
                    cursor.setAttribute('material', 'visible: true');
                    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                    cursor.setAttribute('color', 'black');
                    runState[current_object.uuid].state = "OFF";
                    VRScene.setState({runState: runState});
                },duration_switch);

            }
            break;
        case RuleActionTypes.CHANGE_BACKGROUND:
            runState[sceneName].background = media;
            VRScene.setState({runState: runState, game_graph: game_graph});
            let targetSceneVideo = document.getElementById(actual_sceneimg);
            if(targetSceneVideo.nodeName === 'VIDEO') targetSceneVideo.play();
            break;
        case RuleActionTypes.PLAY_AUDIO:
            //TODO definire la sorgente audio dalla scena, forse gli udio è meglio generarli in create_Scene2, prenderli da qui
            let sound = AudioManager.generateAudio();
            /*let media_audio = `${mediaURL}${window.localStorage.getItem("gameID")}/` + media;
            let sound = new Howl({
                src: [media_audio],
                onplayerror: function() {
                    sound.once('unlock', function() {
                        sound.play();
                    });
                }
                //loop: action.loop,
            });*/
            soundsHub[media] = sound;
            sound.play();
            break;
        case RuleActionTypes.STOP_AUDIO:
            if(soundsHub[media])
                soundsHub[media].stop();
            break;
        case RuleActionTypes.COLLECT_KEY:
            runState[current_object.uuid].state='COLLECTED';
            game_graph.scenes[actual_scene].objects.collectable_keys =
                game_graph.scenes[actual_scene].objects.collectable_keys.filter(obj =>  obj.uuid !== current_object.uuid);
            if(current_object.media0 !== null){
                document.getElementById(actual_scene).needShaderUpdate = true;
            }
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.UNLOCK_LOCK:
            runState[current_object.uuid].state='UNLOCKED';
            game_graph.scenes[actual_scene].objects.locks =
                game_graph.scenes[actual_scene].objects.locks.filter(obj =>  obj.uuid !== current_object.uuid);
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        default:
            console.log('not yet implemented');
            console.log(action);
    }
}

/**
 * Function that manages the transitions
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition(actualScene, targetScene, duration){
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    if(store_utils.getFileType(actualScene.img) === 'video') actualSceneVideo.pause();
    //TODO a volte non trova la scena, verificare perché
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let cursor = document.querySelector('#cursor');
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");

    if(targetScene.type === Values.TWO_DIM) targetSky.setAttribute('position', '0 1.6 -6.44');

    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");

    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');

    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');
    actualSky.dispatchEvent(disappear);
    targetSky.dispatchEvent(appear);

    if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
}

function transition2D(actualScene, targetScene, duration, VRScene){
    let camera = document.getElementById('camera');
    let cursor = document.getElementById('cursor');
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let is3dScene = actualScene.type===Values.THREE_DIM;
    let sceneMovement = is3dScene?targetSky:actualSky;
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let movement = new CustomEvent(sceneMovement.id + "move");

    let rayCastOrigin = is3dScene?'cursor':'mouse';

    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");

    if(is3dScene){
        sceneMovement.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: 0 1.6 -9; ' +
            'to: 0 1.6 -6.44; startEvents: ' + sceneMovement.id + "move")
    } else {
        sceneMovement.setAttribute('animation__moving', 'property: position; dur:' + duration +
        '; easing: linear; from: 0 1.6 -6.44; ' +
            'to: 0 1.6 -9; startEvents: ' + sceneMovement.id + "move")
    }
    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');

    if(store_utils.getFileType(actualScene.img) === 'video') actualSceneVideo.pause();
    actualSky.dispatchEvent(disappear);
    if(!is3dScene) {
        sceneMovement.dispatchEvent(movement);
    }
    setTimeout(function () {
        lookObject(targetSky.id);
        targetSky.dispatchEvent(appear);
        sceneMovement.dispatchEvent(movement);
        //camera.setAttribute("pac-look-controls", "planarScene: " + !is3dScene);
        //camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + is3dScene);
        //cursor.setAttribute('cursor', 'rayOrigin: ' + rayCastOrigin);
        if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
    },duration);

}

function lookObject(idObject){
    let obj = document.getElementById(idObject);
    obj.components.geometry.geometry.computeBoundingSphere();
    let center = obj.components.geometry.geometry.boundingSphere;
    let l = center.center.normalize();
    let camera = document.getElementById('camera');
    let cameraPosition = camera.getAttribute('position');
    let v = new THREE.Vector3(cameraPosition.x, cameraPosition.y, -10).normalize()
    let quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(v, l);
    let euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion, 'YXZ', false);
    camera.setAttribute("pac-look-controls", "planarScene: true" );
    camera.setAttribute("pac-look-controls", "pointerLockEnabled: false" );
    camera.components["pac-look-controls"].yawObject.rotation._y = euler._y
    camera.components["pac-look-controls"].yawObject.rotation._x = 0;
    camera.components["pac-look-controls"].yawObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._x = euler._x
    camera.components["pac-look-controls"].pitchObject.rotation._z =  0;
    camera.components["pac-look-controls"].pitchObject.rotation._y =  0;
    //document.exitPointerLock()
}

export {executeAction,
lookObject}