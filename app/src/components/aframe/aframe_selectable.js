/**
 * Componente A-Frame che gestise l'interazione con la geometria degli oggetti, la cattura del clickl e le animazioni del cursor
 */

import settings from "../../utils/settings";
import stores_utils from "../../data/stores_utils";

const {mediaURL} = settings;
const AFRAME = require('aframe');
const eventBus = require('./eventBus');

AFRAME.registerComponent('selectable', {
    schema: {
        object_uuid:{type: 'string'}, //Uuid oggetto
        visible: {type: 'string', default: 'VISIBLE'}, //Interaggibilita' oggetto
        object_type: {type: 'string'}, //Tipo di oggetto
        activable: {type: 'string', default: 'ACTIVABLE'} //attivabilità dell'oggetto, attivabile di default
    },
//TODO 1 Vittoria: trovare un modo (anche passando un null a selectable) che una volta che siamo lì ci faccia capire che siamo in editMode
// disabilitare selectable in editMode: nello schema si può aggiungere un attributo per l'editMode

    init: function () {
        let elem = this.el;

        //Se interaggibile aggiungo i listener per le animazioni, in base al tipo saranno diverse, e il listener per il click
        //che scatenera' l'evento
        if(this.data.activable === 'ACTIVABLE'){
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
// TODO VITTORIA Se è in edit mode non fare tutto questo, in questo modo basterebbe un curved
        //Se in fasi di gioco cambia l'interaggibilita' di un oggetto la aggiorno aggiungendo o rimuovendo i listeners
        if(this.data.activable === 'ACTIVABLE'){
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

/**
 * Animazioni per l'ingresso e l'uscita del mouse dalla zone interattive degli oggetti
 */
function setMouseEnterTransition() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
}

function setMouseLeaveTransition() {
    let cursor = document.querySelector('#cursor');

    if(cursor) {
        cursor.setAttribute('color', 'black');
        //transizione
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
    }
}

function setMouseEnter() {
    let cursor = document.querySelector('#cursor');
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.01; to:0.001;');
}

function setMouseLeave() {
    let cursor = document.querySelector('#cursor');
    
    if(cursor){
        cursor.setAttribute('color', 'black');
        //non transizione
        cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.001; to:0.01;');
    }

}

/**
 * se il giocatore clicca in una delle geometrie viene lanciato l'evento legato a quella geometria
 * @param event
 */
function setClick(event) {
    event.detail.cursorEl.components.raycaster.intersectedEls.forEach(obj => eventBus.emit('click-'+obj.object_uuid))
}

/**
 * Funzione che premette ai video di essere riprodotti da mac, in origine non potevano essere avviati da soli
 */
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
