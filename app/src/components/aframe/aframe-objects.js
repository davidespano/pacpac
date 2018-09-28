/**
 * function that manages the transitions
 *
 * @param element Curvedimage
 */
function transition(element){
    var sceneEl = document.querySelector('a-scene');
    var elem = element.el;
    var target = element.data.target;
    target = target.replace(/\.[^/.]+$/, "");
    var actualScene = elem.parentElement;
    var targetID = "#" + target;
    var trg = sceneEl.querySelector(targetID);
    var cursor = sceneEl.querySelector('#cursor');

    actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
    trg.setAttribute('animation__appear', 'property: material.opacity; dur: 2000; easing: linear; from: 0; to: 1; startEvents: ' + trg.id + "app");

    elem.addEventListener('click', function (evt) {
        //Diminuisco la dimensione del raycast in modo che non sia spammabile
        cursor.setAttribute('material', 'opacity: 0');
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
};

export {transition}