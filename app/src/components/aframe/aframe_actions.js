import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
const THREE = require('three');
const {mediaURL} = settings;

function executeAction(VRScene, rule, action){
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let current_object = {};

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
                transition(state.activeScene.name, action.target, duration);
            },duration_transition);

            break;
        case RuleActionTypes.FLIP_SWITCH:
            let duration_switch = 0;

            if(runState[current_object.uuid].state === "OFF")
                runState[current_object.uuid].state = "ON";
            else
                runState[current_object.uuid].state = "OFF";

            VRScene.setState({runState: runState});

            /*let objectVideo1_switch = document.querySelector('#media_' + current_object.uuid);
            let objectVideo2_switch = document.querySelector('#mask');
            let current_scene = document.getElementById(state.activeScene.name);
            if(objectVideo1_switch != null) {
                current_scene.setAttribute('src', '#media_' + current_object.uuid)
                objectVideo1_switch.play();
                duration_switch = (objectVideo1_switch.duration * 1000);
            }
            setTimeout(function () {
                current_scene.setAttribute('src', '#mask');
                objectVideo2_switch.play();
            },duration_switch)*/


            break;
        case RuleActionTypes.ON:
            if(runState[current_object.uuid].state === "OFF"){
                runState[current_object.uuid].state = "ON";
                VRScene.setState({runState: runState});
            }

            break;
        case RuleActionTypes.OFF:
            if(runState[current_object.uuid].state === "ON") {
                runState[current_object.uuid].state = "OFF";
                VRScene.setState({runState: runState});
            }
            break;
        default:
            console.log('not yet implemented');
            console.log(action);
    }
}

/**
 * Function that manages the transitions
 * @param actualSceneName
 * @param target
 * @param duration
 */
function transition(actualSceneName, target, duration){

    let actualScene = document.querySelector('#' + actualSceneName);
    let actualSceneVideo = document.getElementById(actualSceneName + '.mp4');
    actualSceneVideo.pause();
    let targetScene = document.querySelector('#' + target);
    let targetSceneVideo = document.getElementById(target + '.mp4');
    let cursor = document.querySelector('#cursor');
    let disappear = new CustomEvent(actualScene.id + "dis");
    let appear = new CustomEvent(targetScene.id + "app");

    actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
    targetScene.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetScene.id + "app");

    actualScene.setAttribute('material', 'depthTest: false');
    targetScene.setAttribute('material', 'depthTest: false');

    targetScene.setAttribute('visible', 'true');
    targetScene.setAttribute('material', 'visible: true');

    actualScene.dispatchEvent(disappear);
    targetScene.dispatchEvent(appear);
    targetSceneVideo.play();
}

function transition2D(element){

}

export {executeAction}