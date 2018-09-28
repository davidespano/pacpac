import 'aframe-animation-component';

var AFRAME = require('aframe');

AFRAME.registerComponent('selectable',
{
    schema: {
        target:{type: 'string'},
    },

    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        target = target.replace(/\.[^/.]+$/, "");
        var actualScene = elem.parentElement;
        var targetID = "#" + target;
        var trg = sceneEl.querySelector(targetID);
        var cursor = sceneEl.querySelector('#cursor');
        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
        trg.setAttribute('animation__appear', 'property: material.opacity; dur: 2000; easing: linear; from: 0; to: 1; startEvents: ' + trg.id + "app");
        elem.addEventListener('mouseenter', function () {
            cursor.setAttribute('color', 'green');
            cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
        });

        elem.addEventListener('mouseleave', function () {
            cursor.setAttribute('color', 'black');
            cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        });

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
        });
    },

    


});

AFRAME.registerComponent('muted', {

    init: function () {
        console.log("sono qui")
        var elem = this.el;
        setTimeout(function() {
            //elem.components.material.material.map.image.pause();
            elem.components.material.material.map.image.autoplay=false;
            elem.components.material.material.map.image.defaultMuted=true;
        }, 1000);
    }

});

