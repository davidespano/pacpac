import 'aframe-animation-component';
import {transition} from "./aframe-objects";

let AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {
    schema: {
        target:{type: 'string'},
    },

    init: function () {
        let sceneEl = document.querySelector('a-scene');
        let elem = this.el;
        let cursor = sceneEl.querySelector('#cursor');

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

    schema:{
        active: {type: 'boolean', default: 'false'},
    },

    init: function () {
        let elem = this.el;
        let data = this.data.active;
        setTimeout(function() {
            if(data) {
                elem.components.material.material.map.image.pause();
            }
            elem.components.material.material.map.image.muted=true;
        }, 500);
    }
})

