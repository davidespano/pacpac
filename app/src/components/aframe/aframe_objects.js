/**
 * Function that manages the transitions
 * @param actualSceneName
 * @param target
 * @param duration
 */
function transition(actualSceneName, target, duration){

    let actualScene = document.querySelector('#' + actualSceneName);
    let trg = document.querySelector('#' + target);
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

function transition2D(element){

}

export {transition, transition2D}