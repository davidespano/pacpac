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
        visible: {type: 'string', default: 'VISIBLE'}
    },

    init: function () {
        let elem = this.el;
        if(this.data.visible === 'VISIBLE'){
            elem.addEventListener('mouseenter', setMouseEnter);
            elem.addEventListener('mouseleave', setMouseLeave);
            elem.addEventListener('click', setClick);
        }
    },

    update: function (data) {
        let elem = this.el;


        if(this.data.visible === 'VISIBLE'){
            //console.log('ciao')
            //console.log(this.data.visible)
            //console.log(this.data.object_uuid)
            elem.addEventListener('mouseenter', setMouseEnter);
            elem.addEventListener('mouseleave', setMouseLeave);
            elem.addEventListener('click', setClick);
        } else {
            //console.log('ciao')
            elem.removeEventListener('mouseenter', setMouseEnter);
            elem.removeEventListener('mouseleave', setMouseLeave);
            elem.removeEventListener('click', setClick);
        }
        if(this.data.object_uuid!==""){
            elem['object_uuid'] = this.data.object_uuid;
            elem.setAttribute('data-raycastable', true);
        }else {
            elem.removeAttribute('data-raycastable');
        }
    },

    remove: function () {
        let elem = this.el;
        elem.removeEventListener('mouseenter', setMouseEnter);
        elem.removeEventListener('mouseleave', setMouseLeave);
        elem.removeEventListener('click', setClick);
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

AFRAME.registerComponent('dolby', {
    schema:{
        active: {type: 'boolean', default: false}
    },

    init: function () {

        if(this.data.active ){

            Howler.pos([0,0,0]);
            Howler.orientation(-0.5,0,0,0,1,0);

            /*let mono_F_L = `${mediaURL}${window.localStorage.getItem("gameID")}/` + 'alarm.mp3';
            let mono_F_R = `${mediaURL}${window.localStorage.getItem("gameID")}/` + 'FR.mp3';
            let mono_R_L = `${mediaURL}${window.localStorage.getItem("gameID")}/` + 'RL.mp3';
            let mono_R_R = `${mediaURL}${window.localStorage.getItem("gameID")}/` + 'RR.mp3';

            let FL = new Howl({ src: [mono_F_L], loop: true});
            let FR = new Howl({ src: [mono_F_R], loop: true});
            let RL = new Howl({ src: [mono_R_L], loop: true});
            let RR = new Howl({ src: [mono_R_R], loop: true});

            let idFL = FL.play();
            let idFR = FR.play();
            let idRL = RL.play();
            let idRR = RR.play();

            FL.pos(-2,2,-0.5, idFL);*/
            //FR.pos(2,2,-0.5, idFR);
            //RL.pos(-2,-2,-0.5, idRL);
            //RR.pos(2,-2,-0.5, idRR);
            let four_channel = `${mediaURL}${window.localStorage.getItem("gameID")}/` + 'four_channel_output.mp4';
            let fChannel = new Howl({ src: [four_channel], loop: true});
            let idf = fChannel.play();
            fChannel.pos(0,0,0,idf);


            /*FL.pannerAttr({
                panningModel: 'equalpower',
                refDistance: 1.5,
                rolloffFactor: 2.5,
                distanceModel: 'exponential'
            }, sound);*/
        }

    }

});
