import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import settings from "../../utils/settings";
import './aframe_shader'
const THREE = require('three');
const {mediaURL} = settings;

function executeAction(state, rule, action){
    switch (action.type) {
        case RuleActionTypes.TRANSITION:
            let duration = 2000;
            let current_object = {};
            let mediaDuration = 0;
            Object.values(state.activeScene.objects).flat().forEach(t =>{ //we should check the other objects as well
                if(t.uuid === rule.object_uuid){
                    duration = t.duration;
                    current_object = t;
                }
            });
            let material = document.getElementById(state.activeScene.name).getOrCreateObject3D('mesh').material;
            let objectVideo = (material.uniforms)?material.uniforms[`video${rule.object_uuid.replace(/-/g,'_')}`].value.image:null;
            if(objectVideo != null) {
                objectVideo.play();
                mediaDuration = (objectVideo.duration * 1000) - 300;
                //shader(state.activeScene.name,state.activeScene.img, current_object);
            }

            setTimeout(function () {
                if(objectVideo != null) objectVideo.pause();
                transition(state.activeScene.name, action.target, 2000);
            },mediaDuration)
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
    targetScene.setAttribute('material', 'visible: true');


    //targetScene.components.material.material.map.image.muted=true;

    actualScene.dispatchEvent(disappear);
    targetScene.dispatchEvent(appear);
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