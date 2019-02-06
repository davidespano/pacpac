import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
import {Howl} from 'howler';
const THREE = require('three');
const {mediaURL} = settings;
const soundsHub = require('./soundsHub');

function executeAction(VRScene, rule, action){
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let actual_scene = VRScene.state.activeScene.name;
    let current_object = {};
    let game_graph = VRScene.state.graph;
    Object.values(state.activeScene.objects).flat().forEach(o =>{
        if(o.uuid === rule.object_uuid){
            current_object = o;

        }
    });

    switch (action.type) {
        case RuleActionTypes.TRANSITION:
            let duration_transition = 0;
            let cursor = document.querySelector('#cursor');
            let duration = current_object.properties.duration;
            cursor.setAttribute('material', 'visible: false');
            cursor.setAttribute('raycaster', 'far: 0.1');

            let objectVideo_transition = document.querySelector('#media_' + current_object.uuid);

            if(objectVideo_transition != null) {
                objectVideo_transition.play();
                duration_transition = (objectVideo_transition.duration * 1000);
            }

            setTimeout(function () {
                if(objectVideo_transition != null) objectVideo_transition.pause();
                transition(state.activeScene, state.graph.scenes[action.target], duration);
            },duration_transition);

            break;
        case RuleActionTypes.FLIP_SWITCH:
            let duration_switch = 0;
            let switchVideo = document.getElementById('media_'+current_object.uuid);

            if(switchVideo != null) {
                switchVideo.play();
                duration_switch = (switchVideo.duration * 1000);
            }
            setTimeout(function () {
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
                    switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }
                setTimeout(function () {
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
                    switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }
                setTimeout(function () {
                    runState[current_object.uuid].state = "OFF";
                    VRScene.setState({runState: runState});
                },duration_switch);

            }
            break;
        case RuleActionTypes.CHANGE_BACKGROUND:
            let scene = action.targetScene;
            let media = action.media;
            runState[scene].background = media;
            VRScene.setState({runState: runState});
            let targetSceneVideo = document.getElementById(scene + '.mp4');
            targetSceneVideo.play();
            break;
        case RuleActionTypes.PLAY_AUDIO:
            let media_audio = `${mediaURL}${window.localStorage.getItem("gameID")}/` + action.media;
            let sound = new Howl({
                src: [media_audio],
                loop: action.loop,
            });
            soundsHub[action.media] = sound;
            sound.play();
            break;
        case RuleActionTypes.STOP_AUDIO:
            if(soundsHub[action.media])
                soundsHub[action.media].stop();
            break;
        case RuleActionTypes.COLLECT_KEY:
            runState[current_object.uuid].state=true;
            game_graph.scenes[actual_scene].objects.collectable_keys =
                game_graph.scenes[actual_scene].objects.collectable_keys.filter(obj =>  obj.uuid !== current_object.uuid);
            if(current_object.media0 !== null){
                document.getElementById(actual_scene).needShaderUpdate = true;
            }
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.UNLOCK_LOCK:
            runState[current_object.uuid].state=true;
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
    actualSceneVideo.pause();
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
    targetSceneVideo.play();
}

function transition2D(element){

}

export {executeAction}