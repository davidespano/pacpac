import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
import {Howl} from 'howler';
import store_utils from '../../data/stores_utils'
import AudioManager from './AudioManager'
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

    console.log(action)
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
                transition(state.activeScene, state.graph.scenes[media], duration);
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
    console.log(targetScene.name)
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let cursor = document.querySelector('#cursor');
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
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

function transition2D(actualScene){
    let camera;
    let actualSky = document.querySelector('#' + actualScene.name);
    let disappear = new CustomEvent(actualSky.id + "dis");
    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: 500' +
        '; easing: linear; from: 1; to: 0.1; startEvents: ' + actualSky.id + "dis");

    document.querySelector('#camera').object3D.getWorldDirection(camera);
    let plane = document.createElement('a-plane');

    actualSky.dispatchEvent(disappear);
}

export {executeAction}