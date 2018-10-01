import 'aframe-animation-component';
import {transition} from "./aframe-objects";

var AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {
    schema: {
        target:{type: 'string'},
    },

    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var cursor = sceneEl.querySelector('#cursor');

        elem.addEventListener('mouseenter', function () {
            cursor.setAttribute('color', 'green');
            cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
        });

        elem.addEventListener('mouseleave', function () {
            cursor.setAttribute('color', 'black');
            cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        });

        transition(this);
    }
});

AFRAME.registerComponent('muted', {

    init: function () {
        console.log("sono qui")
        var elem = this.el;
        setTimeout(function() {
            console.log(elem.components)
            elem.components.material.material.map.image.autoplay=false;
            elem.components.material.material.map.image.defaultMuted=true;
        }, 5000);
    }
})

