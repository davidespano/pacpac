//import 'aframe-animation-component';
import {Howl, Howler} from "howler";
import settings from "../../utils/settings";
import {ResonanceAudio} from "resonance-audio";
import stores_utils from "../../data/stores_utils";

const {mediaURL} = settings;
const AFRAME = require('aframe');
const eventBus = require('./eventBus');

AFRAME.registerComponent('selectable', {
    schema: {
        object_uuid:{type: 'string'},
        visible: {type: 'string', default: 'VISIBLE'},
        object_type: {type: 'string'}
    },

    init: function () {
        let elem = this.el;

        if(this.data.visible === 'VISIBLE'){
            if(this.data.object_type === 'TRANSITION'){
                elem.addEventListener('mouseenter', setMouseEnterTransition);
                elem.addEventListener('mouseleave', setMouseLeaveTransition);
            } else {
                elem.addEventListener('mouseenter', setMouseEnter);
                elem.addEventListener('mouseleave', setMouseLeave);
            }
            elem.addEventListener('click', setClick);
        }
    },

    update: function () {
        let elem = this.el;

        if(this.data.visible === 'VISIBLE'){
            if(this.data.object_type === 'TRANSITION'){
                elem.addEventListener('mouseenter', setMouseEnterTransition);
                elem.addEventListener('mouseleave', setMouseLeaveTransition);
            } else {
                elem.addEventListener('mouseenter', setMouseEnter);
                elem.addEventListener('mouseleave', setMouseLeave);
            }
            elem.addEventListener('click', setClick);
        } else {
            if(this.data.object_type === 'TRANSITION'){
                elem.removeEventListener('mouseenter', setMouseEnterTransition);
                elem.removeEventListener('mouseleave', setMouseLeaveTransition);
            } else {
                elem.removeEventListener('mouseenter', setMouseEnter);
                elem.removeEventListener('mouseleave', setMouseLeave);
            }
            elem.removeEventListener('click', setClick);
        }
        if(this.data.object_uuid!==""){
            elem['object_uuid'] = this.data.object_uuid;
            elem.setAttribute('data-raycastable', true);
        }else {
            elem.removeAttribute('data-raycastable');
        }
    },
});

function setMouseEnterTransition() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
}

function setMouseLeaveTransition() {
    let cursor = document.querySelector('#cursor');

    cursor.setAttribute('color', 'black');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
}

function setMouseEnter() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.01; to:0.001;');
}

function setMouseLeave() {
    let cursor = document.querySelector('#cursor');

    cursor.setAttribute('color', 'black');
    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.001; to:0.01;');
}
function setClick(event) {
    event.detail.cursorEl.components.raycaster.intersectedEls.forEach(obj => eventBus.emit('click-'+obj.object_uuid))
}

AFRAME.registerComponent('play_video', {

    schema:{
        active: {type: 'boolean', default: false},
        video: {type: 'string', default: ''}
    },

    init: function () {
        let videoID = this.data.video;
        let active= this.data.active;
        if(active && (stores_utils.getFileType(videoID) === 'video')){
            setTimeout(function() {
                let video = document.getElementById(videoID).play();
                if(video !== undefined){
                    video.catch(error => {

                    }).then(() => {

                    })
                }
            }, 500);
        }

    }
});

AFRAME.registerComponent('auto-enter-vr', {
    init: function () {
        this.el.sceneEl.enterVR();
    }
});
