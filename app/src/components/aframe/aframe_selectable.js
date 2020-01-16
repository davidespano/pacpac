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

    init: function () {
        let elem = this.el;

        //Se interaggibile aggiungo i listener per le animazioni, in base al tipo saranno diverse, e il listener per il click
        //che scatenera' l'evento
        if(this.data.visible === 'VISIBLE' ){
            if(this.data.object_type === 'TRANSITION'){
                    elem.addEventListener('mouseenter', setMouseEnterTransition); //transizioni visibili e attivabili
                    elem.addEventListener('mouseleave', setMouseLeaveTransition);
            }
            else {
                elem.addEventListener('mouseenter', setMouseEnter);
                elem.addEventListener('mouseleave', setMouseLeave);
            }
            elem.addEventListener('click', setClick);
        }
    },

    update: function () {
        let elem = this.el;

        //Se in fasi di gioco cambia l'interaggibilita' di un oggetto la aggiorno aggiungendo o rimuovendo i listeners
        //se l'elemento non è visibile non gli aggiungo il listener e il cursore non ci può interagire
        if(this.data.visible === 'VISIBLE'){
            if(this.data.object_type === 'TRANSITION'){ //transizioni
                if(this.data.activable==='ACTIVABLE'){
                    elem.addEventListener('mouseenter', setMouseEnterTransition); //transizioni visibili e attivabili
                    elem.addEventListener('mouseleave', setMouseLeaveTransition);
                    elem.removeEventListener('mouseenter', setMouseEnterTransitionNotActive); //rimuovo l'event listener altrimenti collidono
               }
                else{
                    elem.addEventListener('mouseenter', setMouseEnterTransitionNotActive);//transizioni visibili e non attivabili
                    elem.addEventListener('mouseleave', setMouseLeaveTransition);
                    elem.removeEventListener('mouseenter', setMouseEnterTransition);
                }
                elem.addEventListener('click', setClick);
            }
            else { //oggetti generici
                if(this.data.activable==='ACTIVABLE'){
                    elem.addEventListener('mouseenter', setMouseEnter); //oggetti generici visibili e attivabili
                    elem.addEventListener('mouseleave', setMouseLeave);
                    elem.removeEventListener('mouseenter', setMouseEnterNotActive);
                }
                else {
                    elem.addEventListener('mouseenter', setMouseEnterNotActive); //oggetti generici visibili e non attivabili
                    elem.addEventListener('mouseleave', setMouseLeave);
                    elem.removeEventListener('mouseenter', setMouseEnter); //oggetti generici visibili e attivabili

                }
                elem.addEventListener('click', setClick);
            }

        } else { //oggetti non visibili
            if(this.data.object_type === 'TRANSITION'){
                elem.removeEventListener('mouseenter', setMouseEnterTransition); //transizioni non visibili
                elem.removeEventListener('mouseleave', setMouseLeaveTransition);
            } else {
                elem.emit('mouseleave');
                elem.removeEventListener('mouseenter', setMouseEnter); //oggetti generici non visibili
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

/**
 * Nel caso della transizione nel 3d voglio un comportamento diverso del cursore
 */
function setMouseEnterTransition() {
    let cursor = document.querySelector('#cursor');
    //nel 3d
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
    //nel 2d
    document.getElementsByClassName('a-canvas')[0].style = 'cursor: pointer';
}

/**
 * Funzione per le transizioni visibili ma non attive (forse si può unificare con setMouseEnterTransition)
 */
function setMouseEnterTransitionNotActive(){
    let cursor = document.querySelector('#cursor');
    //nel 3d
    cursor.setAttribute('color', 'red');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:2 2 2;');
    //nel 2d
    document.getElementsByClassName('a-canvas')[0].style = 'cursor: not-allowed';
}

function setMouseLeaveTransition() {
    let cursor = document.querySelector('#cursor');
    //3d
    if(cursor) {
        cursor.setAttribute('color', 'black');
        //transizione
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.001; to:0.01;');
        //nel 2d
        document.getElementsByClassName('a-canvas')[0].style = 'cursor: default';
    }
}

function setMouseEnter() {
    let cursor = document.querySelector('#cursor');
    //3d
    cursor.setAttribute('color', 'green');
    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.01; to:0.001;');
    //2d
    document.getElementsByClassName('a-canvas')[0].style = 'cursor: pointer';
}

/**
    Funzione per gli elementi visibili non attivi (ad eccezione della transizione)
**/
function setMouseEnterNotActive() {
    let cursor = document.querySelector('#cursor');
    //3d
    cursor.setAttribute('color', 'red');
    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.01; to:0.001;');
    //2d
    document.getElementsByClassName('a-canvas')[0].style = 'cursor: not-allowed';
}

function setMouseLeave() {
    let cursor = document.querySelector('#cursor');
    if(cursor){
        //3d
        cursor.setAttribute('color', 'black');
        cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.001; to:0.01;');
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:1 1 1; to:1 1 1;');
        //2d
        document.getElementsByClassName('a-canvas')[0].style = 'cursor: default';
    }
}

/**
 * se il giocatore clicca in una delle geometrie viene lanciato l'evento legato a quella geometria
 * @param event
 */
function setClick(event) {
    event.detail.cursorEl.components.raycaster.intersectedEls.forEach(
        obj => {
            eventBus.emit('PLAYER-click-'+ obj.object_uuid)
        }
    );
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
