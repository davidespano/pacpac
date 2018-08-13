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
        });
    }


});

AFRAME.registerComponent('muted', {

    init: function () {
        var vid = document.getElementById("bolla02");
        vid.muted = true;
    }

});

AFRAME.registerComponent('mySound',{
    schema: {
        src:{type: 'string'}
    },

    init: function () {
        var elem = this.el;
        var actualScene = elem.parentElement;
        var sound = document.createElement('a-sound')

        actualScene.setAttribute('sound', 'http://localhost:3000/media/2k/provaSound.mp3');
        actualScene.setAttribute('autoplay', 'true')
    }
});