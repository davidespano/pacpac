/**
 * Componente A-Frame che salva lìintersezione del raycast del mouse con la bolla o il piano della scena
 */

var AFRAME = require('aframe');

AFRAME.registerComponent('pointsaver',
{
    schema:{
        points:{type: 'array', default: []}, //Punti salvati
        isCurved:{type: 'boolean', default: true}, //Distingue se la geometria e' 2D o 3D
        isPoint:{type: 'boolean', default: false}, //Distingue se e' un punto
        uuid:{type: 'string', default: ''} //uuid della geometria
    },

    init: function () {

        //Se e' un oggetto audio mi serve solo un punto, la funzione sara' diversa
        if(!this.data.isCurved || this.data.isPoint){
            this.el.addEventListener('click', pointSaverAudio);
        } else {
            this.el.addEventListener('click', pointSaverCurved);
        }
    },
    
    remove: function () {
        let cursor = document.querySelector('a-cursor');
        if(cursor)
            cursor.removeEventListener('click', pointSaverCurved);
    }
});

function pointSaverCurved(evt)
{
    //let a_point = document.querySelector('#cursor').components.pointsaver.points;
    let cursor =  document.querySelector('#cursor');
    if(!cursor.components.pointsaver.points){
        cursor.components.pointsaver.points = [];
    }
    cursor.components.pointsaver.points.push(evt.detail.intersection.point);
}

function pointSaverAudio(evt) {
    let cursor =  document.querySelector('#cursor');
    if(!cursor.components.pointsaver.points){
        cursor.components.pointsaver.points = [];
    }
    cursor.components.pointsaver.points[0] = evt.detail.intersection.point;
}

