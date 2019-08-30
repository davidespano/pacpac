import RuleActionTypes from "../../rules/RuleActionTypes";
import settings from "../../utils/settings";
import {Howl} from 'howler';
import store_utils from '../../data/stores_utils'
import AudioManager from './AudioManager'
import Values from '../../rules/Values';
import './aframe_shader'
const THREE = require('three');
const {mediaURL} = settings;
const soundsHub = require('./soundsHub');
const AFRAME = require('aframe');

function executeAction(VRScene, rule, action){
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let actual_scene = VRScene.state.activeScene.name;
    let actual_sceneimg = VRScene.state.activeScene.img;
    let actual_scene_Uuid = VRScene.state.activeScene.uuid;
    let game_graph = VRScene.state.graph;
    let current_object = game_graph['objects'].get(rule.event.obj_uuid);
    let sceneName = action.subj_uuid;
    //TODO cambiare nome media non è il media
    let media = action.obj_uuid;
    console.log(media)
    let cursor = document.querySelector('#cursor');
    /*Object.values(state.activeScene.objects).flat().forEach(o =>{
        if(o.uuid === rule.event.obj_uuid){
            current_object = o;
        }
    });*/
    console.log(game_graph)
    switch (action.action) {
        case RuleActionTypes.TRANSITION:
            let duration_transition = 0;
            let duration = current_object.properties.duration ? current_object.properties.duration : 0;
            let direction = current_object.properties.direction ? current_object.properties.direction : 'nothing'
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
            let audioTransition = current_object.audio.audio0;
            if(soundsHub['audio0_' + audioTransition])
                soundsHub['audio0_' + audioTransition].play();
            setTimeout(function () {
                if(soundsHub[VRScene.state.activeScene.music] && soundsHub[state.graph.scenes[media].music] &&
                  (soundsHub[VRScene.state.activeScene.music].file !== soundsHub[state.graph.scenes[media].music].file)){
                    console.log('sto entrando qui ')
                    console.log(soundsHub[VRScene.state.activeScene.music])
                    soundsHub[VRScene.state.activeScene.music].pause()
                    soundsHub[VRScene.state.activeScene.music].currentTime = 0;
                }

                if(objectVideo_transition !== 0 && objectVideo_transition !== null &&
                    (store_utils.getFileType(objectVideo_transition.img) === 'video')) objectVideo_transition.pause();
                // se le due scene sono dello stesso tipo le gestisco allo stesso modo
                if(VRScene.state.activeScene.type === Values.THREE_DIM && state.graph.scenes[media].type === Values.THREE_DIM ||
                   VRScene.state.activeScene.type === Values.TWO_DIM && state.graph.scenes[media].type === Values.TWO_DIM)
                    transition(state.activeScene, state.graph.scenes[media], duration, direction);
                else
                    transition2D(state.activeScene, state.graph.scenes[media], duration, VRScene)
            },duration_transition);

            break;
        case RuleActionTypes.CHANGE_STATE:
            switch (action.obj_uuid){
                case 'ON':
                case 'OFF':
                    changeStateSwitch(VRScene, runState, current_object, cursor, action);
                    break;
                case 'COLLECTED':
                    changeStateObject(VRScene, runState, game_graph, 'COLLECTED', current_object, action.subj_uuid);
                    break;
                case 'UNLOCKED':
                    changeStateObject(VRScene, runState, game_graph, 'UNLOCKED', current_object, action.subj_uuid);
                    break;
            }
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
            if(soundsHub["audios_"+ actual_scene_Uuid]){
                soundsHub["audios_"+ actual_scene_Uuid].pause();
                let audioVideo = {};
                audioVideo.file = media;
                audioVideo.loop = soundsHub["audios_"+ actual_scene_Uuid].loop;
                audioVideo.volume = 80;
                soundsHub["audios_"+ actual_scene_Uuid] = AudioManager.generateAudio(audioVideo, [0,0,0]);
                soundsHub["audios_"+ actual_scene_Uuid].play()
            }
            let targetSceneVideo = document.getElementById(media);
            if(targetSceneVideo.nodeName === 'VIDEO') targetSceneVideo.play();
            break;
        case RuleActionTypes.PLAY:
            //verifico se è un video
            if(soundsHub["audios_"+ media]){
                soundsHub["audios_"+ media].loop = false;
                soundsHub["audios_"+ media].play();
            } else {
                if(document.getElementById(actual_sceneimg) !== null){
                    let actualVideoLoop = document.getElementById(actual_sceneimg);
                    if(actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = false;
                        //document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true
                    }
                    //VRScene.setState({runState: runState, game_graph: game_graph});
                }
            }
            break;
        case RuleActionTypes.PLAY_LOOP:
            //TODO rivedere questi controlli fanno un po' schifo
            if(soundsHub["audios_"+ media]){
                soundsHub["audios_"+ media].loop = false;
                soundsHub["audios_"+ media].play();
            } else {
                if(document.getElementById(actual_sceneimg) !== null){
                    let actualVideoLoop = document.getElementById(actual_sceneimg);
                    if(actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = true;
                    }
                }
            }
            break;
        case RuleActionTypes.STOP:
            //TODO stoppare un video forse non ha senso, poi vediamo
            if(soundsHub["audios_"+ media] && document.querySelector('media_' + media) === null)
                soundsHub["audios_"+ media].stop();
            break;
        case RuleActionTypes.COLLECT_KEY:
            changeStateObject(VRScene, runState, game_graph, 'COLLECTED', current_object, action.obj_uuid);
            break;
        case RuleActionTypes.UNLOCK_LOCK:
            changeStateObject(VRScene, runState, game_graph, 'UNLOCKED', current_object, action.obj_uuid);
            break;
        case RuleActionTypes.CHANGE_VISIBILITY:
            let obj = document.querySelector('#curv' + action.subj_uuid);
            let mediaObj = document.querySelector('#media_' + action.subj_uuid);
            if(obj)
                obj.setAttribute('selectable', {visible: action.obj_uuid});
            console.log(mediaObj)
            runState[action.subj_uuid].visible=action.obj_uuid;
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.LOOK_AT:
            //TODO capire se si può cambiare punto di vista piano
            let pointOI = game_graph['objects'].get(action.obj_uuid);
            console.log(VRScene.state.activeScene.type)
            if(VRScene.state.activeScene.type === '3D')
                setTimeout(function () {
                    lookObject('curv' + action.obj_uuid, pointOI.vertices);
                }, 1000)
            break;
        case RuleActionTypes.DECREASE:
            if (runState[action.subj_uuid].state >= 0)
                runState[action.subj_uuid].state -= game_graph['objects'].get(action.subj_uuid).properties.step;
            VRScene.setState({runState: runState, graph: game_graph});
            console.log(runState[action.subj_uuid])
            break;
        case RuleActionTypes.INCREASE:
            console.log(game_graph['objects'].get(action.subj_uuid))
            runState[action.subj_uuid].state += game_graph['objects'].get(action.subj_uuid).properties.step;
            VRScene.setState({runState: runState, graph: game_graph});
            console.log(runState[action.subj_uuid])
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
function transition(actualScene, targetScene, duration, direction){
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    if(store_utils.getFileType(actualScene.img) === 'video') actualSceneVideo.pause();
    //TODO a volte non trova la scena, verificare perché
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let actualMove = new CustomEvent(actualSky.id + "actual");
    let targetMove = new CustomEvent(targetSky.id + "target");
    let sceneMovement = true;
    let is3dScene = actualScene.type===Values.THREE_DIM;
    let positionTarget;
    let positionActual;
    let canvasWidth = document.documentElement.clientWidth / 100;
    let canvasHeight = canvasWidth /1.77;
    switch (direction) {
        case 'RIGHT':
            positionTarget = canvasWidth + ', 1.6, -6.44';
            positionActual = -canvasWidth + ', 1.6, -6.44';
            break;
        case 'LEFT':
            positionTarget = -canvasWidth + ', 1.6, -6.44';
            positionActual =canvasWidth + ', 1.6, -6.44';
            break;
        case 'UP':
            positionTarget = '0, ' + (canvasHeight + 1.6) + ', -6.44';
            positionActual = '0, ' + (-canvasHeight + 1.6) + ', -6.44';
            break;
        case 'DOWN':
            positionTarget = '0, ' + (-canvasHeight + 1.6) + ', -6.44';
            positionActual = '0, ' + (canvasHeight + 1.6) + ', -6.44';
            break;
        default:
            positionTarget = "0, 1.6, -6.44";
            positionActual = "0, 1.6, -6.44";
            break;
    }
    if(targetScene.type === Values.TWO_DIM) targetSky.setAttribute('position', positionTarget);

    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");
    //TODO impostare uno dei valori da editor a nessuno o una direzione, differenziare anceh se
    // sono scene 3D o 2D, nel 3D non vogliamo questo effetto, credo
    if(sceneMovement && !is3dScene){
        actualSky.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: 0 1.6 -6.44; ' +
            'to: '+ positionActual +'; startEvents: ' + actualSky.id + "actual")
        targetSky.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: '+ positionTarget +'; ' +
            'to: 0 1.6 -6.44; startEvents: ' + targetSky.id + "target")
    }
    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');

    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');
    actualSky.dispatchEvent(disappear);
    targetSky.dispatchEvent(appear);

    if(sceneMovement&& !is3dScene){
        actualSky.dispatchEvent(actualMove);
        targetSky.dispatchEvent(targetMove);
    }
    if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
}

/**
 * Function called only in transioto between diferent type of scene, 3D -> 2D or 2D -> 3D
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition2D(actualScene, targetScene, duration){
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
        if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
    },duration);

}

function lookObject(idObject, pointOI = null){
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
    if(pointOI === null){
        camera.setAttribute("pac-look-controls", "planarScene: true" );
        camera.setAttribute("pac-look-controls", "pointerLockEnabled: false" );
    } else {
        let points = pointOI.split(' ').map(function(x){return parseFloat(x);});
        let p = new THREE.Vector3( points[0], points[1], points[2] );
        l = p.normalize();
        quaternion.setFromUnitVectors(v, l);
        euler.setFromQuaternion(quaternion, 'YXZ', false);
    }
    camera.components["pac-look-controls"].yawObject.rotation._y = euler._y;
    camera.components["pac-look-controls"].yawObject.rotation._x = 0;
    camera.components["pac-look-controls"].yawObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._x = euler._x;
    camera.components["pac-look-controls"].pitchObject.rotation._z =  0;
    camera.components["pac-look-controls"].pitchObject.rotation._y =  0;
    //document.exitPointerLock()
}

/**
 * Function for play the audio and update the state of a object
 * @param VRScene
 * @param runState
 * @param game_graph
 * @param state
 * @param current_object
 * @param action_uuid
 */
function changeStateObject(VRScene, runState, game_graph, state, current_object, action_uuid){
    runState[action_uuid].state=state;
    let audioKey = current_object.audio.audio0;
    if(soundsHub['audio0_' + audioKey])
        soundsHub['audio0_' + audioKey].play();
    game_graph.scenes[VRScene.state.activeScene.uuid].objects.collectable_keys =
        game_graph.scenes[VRScene.state.activeScene.uuid].objects.collectable_keys.filter(obj =>  obj.uuid !== current_object.uuid);
    if(current_object.media0 !== null){
        document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
    }
    VRScene.setState({runState: runState, graph: game_graph});
}

function changeStateSwitch(VRScene, runState, current_object, cursor, action) {
    let duration_switch = 0;
    let switchVideo = document.getElementById('media_'+current_object.uuid);

    if(switchVideo != null) {
        cursor.setAttribute('material', 'visible: false');
        cursor.setAttribute('raycaster', 'far: 0.1');

        let videoType = current_object.properties.state === 'ON'?current_object.media.media0:current_object.media.media1

        if(store_utils.getFileType(videoType) === 'video') switchVideo.play();
        duration_switch = (switchVideo.duration * 1000);
    }

    let audio = current_object.properties.state === 'ON'?current_object.audio.audio0:current_object.audio.audio1
    let idAudio = current_object.properties.state === 'ON'?'audio0_':'audio1_';
    if(soundsHub[idAudio + audio])
        soundsHub[idAudio + audio].play();

    setTimeout(function () {
        cursor.setAttribute('raycaster', 'far: 10000');
        cursor.setAttribute('material', 'visible: true');
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        cursor.setAttribute('color', 'black');
        runState[action.subj_uuid].state = action.obj_uuid;
        VRScene.setState({runState: runState});
    },duration_switch);
}
export {executeAction,
lookObject}