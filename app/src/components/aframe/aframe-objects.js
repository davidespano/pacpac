/**
 * function that manages the transitions
 *
 * @param element Curvedimage
 */
function transition(element){
    let sceneEl = document.querySelector('a-scene');
    let elem = element.el;
    let target = element.data.target;
    target = target.replace(/\.[^/.]+$/, "");
    let actualScene = elem.parentElement;
    let targetID = "#" + target;
    let trg = sceneEl.querySelector(targetID);
    let cursor = sceneEl.querySelector('#cursor');
    actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
    trg.setAttribute('animation__appear', 'property: material.opacity; dur: 2000; easing: linear; from: 0; to: 1; startEvents: ' + trg.id + "app");

    elem.addEventListener('click', function (evt) {
        //Diminuisco la dimensione del raycast in modo che non sia spammabile
        cursor.setAttribute('material', 'visible: false');
        cursor.setAttribute('raycaster', 'far: 0.1');
        trg.setAttribute('material', 'visible: true');
        var disappear = new CustomEvent(actualScene.id + "dis");
        var appear = new CustomEvent(trg.id + "app");
        actualScene.dispatchEvent(disappear);
        trg.dispatchEvent(appear);
        trg.components.material.material.map.image.play();
        trg.components.material.material.map.image.muted=true;
        actualScene.components.material.material.map.image.pause();
    })
}

function transition2D(element){

}

export {transition, transition2D}