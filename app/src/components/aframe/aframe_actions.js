import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
const THREE = require('three');
const {mediaURL} = settings;

function executeAction(state, rule, action){
    switch (action.type) {
        case RuleActionTypes.TRANSITION:
            let duration = 2000;
            let current_transition = {};
            let duration_transition = 0;
            Object.values(state.activeScene.objects).flat().forEach(t =>{ //we should check the other objects as well
                if(t.uuid === rule.object_uuid){
                    duration = t.properties.duration;
                    current_transition = t;

                }
            });

            let objectVideo_transition = document.querySelector('#media_' + current_transition.uuid);

            if(objectVideo_transition != null) {
                objectVideo_transition.play();
                duration_transition = (objectVideo_transition.duration * 1000);
            }

            setTimeout(function () {
                if(objectVideo_transition != null) objectVideo_transition.pause();
                transition(state.activeScene.name, action.target, duration);
            },duration_transition)
            break;
        case RuleActionTypes.FLIP_SWITCH:
            let current_switch = {};
            let duration_switch = 0;
            Object.values(state.activeScene.objects).flat().forEach(t =>{ //we should check the other objects as well
                if(t.uuid === rule.object_uuid){
                    duration = t.properties.duration;
                    current_switch = t;

                }
            });
            let objectVideo1_switch = document.querySelector('#media_' + current_switch.uuid);
            console.log(objectVideo1_switch)
            let objectVideo2_switch = document.querySelector('#mask');
            let current_scene = document.getElementById(state.activeScene.name);
            console.log(current_scene)
            if(objectVideo1_switch != null) {
                current_scene.setAttribute('src', '#media_' + current_switch.uuid)
                console.log(current_scene)
                objectVideo1_switch.play();
                duration_switch = (objectVideo1_switch.duration * 1000);
            }
            setTimeout(function () {
                current_scene.setAttribute('src', '#mask');
                objectVideo2_switch.play();
            },duration_switch)

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
    console.log(actualScene)

    actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
    targetScene.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetScene.id + "app");

    cursor.setAttribute('material', 'visible: false');
    cursor.setAttribute('raycaster', 'far: 0.1');
    targetScene.setAttribute('visible', 'true');
    targetScene.setAttribute('material', 'visible: true');

    actualScene.dispatchEvent(disappear);
    targetScene.dispatchEvent(appear);
    targetSceneVideo.play();
}

function shader(sceneName, background, current_object){

    let video = "media_"+current_object.uuid;
    let video1 = new THREE.VideoTexture(document.getElementById(background));
    let video2 = new THREE.VideoTexture(document.getElementById(video));
    let mask = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + current_object.mask);
    let sky = document.getElementById(sceneName);
    let childrenDimension = sky.object3D.children.length - 1;
    sky.setAttribute('material', "shader:multi-video;")

    video1.minFilter = THREE.NearestFilter;
    video2.minFilter = THREE.NearestFilter;
    mask.minFilter = THREE.NearestFilter;

    sky.object3D.children[childrenDimension].material.uniforms.video1.value = video1;
    sky.object3D.children[childrenDimension].material.uniforms.video2.value = video2;
    sky.object3D.children[childrenDimension].material.uniforms.mask.value = mask;
    sky.object3D.children[childrenDimension].material.needsUpdate = true;
    document.getElementById(background).play();
    document.getElementById(video).play();
}

function transition2D(element){

}

export {executeAction}