import 'aframe-animation-component';
import {transition} from "./aframe_actions";

const AFRAME = require('aframe');
const eventBus = require('./eventBus');

AFRAME.registerComponent('selectable', {
    schema: {
        object_uuid:{type: 'string'},
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

        //transition(this);
        let data = this.data;
        elem.addEventListener('click', function () {
            console.log("event: "+'click-'+data.object_uuid);
            eventBus.emit('click-'+data.object_uuid);
        })
    }
});

AFRAME.registerComponent('playVideo', {

    schema:{
        active: {type: 'boolean', default: false},
        video: {type: 'string', default: ''}
    },

    init: function () {

        let videoID = this.data.video;
        let active= this.data.active;
        console.log(videoID)
        console.log(active)
        if(active){
            setTimeout(function() {
                let video = document.getElementById(videoID);
                video.play();
            }, 500);
        }

    }
})

