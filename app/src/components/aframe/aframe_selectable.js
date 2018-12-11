import 'aframe-animation-component';

const AFRAME = require('aframe');
const eventBus = require('./eventBus');

AFRAME.registerComponent('selectable', {
    schema: {
        object_uuid:{type: 'string'},
    },

    update: function (data) {
        let elem = this.el;
        elem.setAttribute('data-raycastable', true);

        if(this.data.object_uuid!==""){
            elem['object_uuid'] = this.data.object_uuid;
            elem.addEventListener('mouseenter', setMouseEnter);
            elem.addEventListener('mouseleave', setMouseLeave);
            elem.addEventListener('click', setClick);
            return;
        }
        elem.removeEventListener('mouseenter', setMouseEnter);
        elem.removeEventListener('mouseleave', setMouseLeave);
        elem.removeEventListener('click', setClick);
        elem.removeAttribute('data-raycastable');

    }
});

function setMouseEnter() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
}

function setMouseLeave() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'black');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
}

function setClick(event) {
    eventBus.emit('click-'+event.target.object_uuid);
}

AFRAME.registerComponent('play_video', {

    schema:{
        active: {type: 'boolean', default: false},
        video: {type: 'string', default: ''}
    },

    init: function () {
        let videoID = this.data.video;
        let active= this.data.active;
        if(active){
            setTimeout(function() {
                let video = document.getElementById(videoID);
                video.play();
            }, 500);
        }

    }
});

AFRAME.registerComponent('auto-enter-vr', {
    init: function () {
        this.el.sceneEl.enterVR();
    }
});

