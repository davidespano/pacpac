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
            Object.values(state.activeScene.objects).flat().forEach(t =>{ //we should check the other objects as well
                if(t.uuid === rule.object_uuid){
                    duration = t.duration;
                    current_object = t;
                    console.log(current_object)
                }

            });
            //shader(state.activeScene.name,state.activeScene.img, current_object);
            transition(state.activeScene.name, action.target, duration);
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
    let trg = document.querySelector('#' + target);
    console.log(target)
    console.log(trg)
    let cursor = document.querySelector('#cursor');
    let disappear = new CustomEvent(actualScene.id + "dis");
    let appear = new CustomEvent(trg.id + "app");

    actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
    trg.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + trg.id + "app");

    cursor.setAttribute('material', 'visible: false');
    cursor.setAttribute('raycaster', 'far: 0.1');
    trg.setAttribute('material', 'visible: true');

    actualScene.components.material.material.map.image.pause();
    trg.components.material.material.map.image.muted=true;

    actualScene.dispatchEvent(disappear);
    trg.dispatchEvent(appear);

    trg.components.material.material.map.image.play();
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