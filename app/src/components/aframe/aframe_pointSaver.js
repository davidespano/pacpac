var AFRAME = require('aframe');

AFRAME.registerComponent('pointsaver',
{
    schema:{
        points:{type: 'array', default: []},
        isCurved:{type: 'boolean', default: true},
        isPoint:{type: 'boolean', default: false},
        uuid:{type: 'string', default: ''}
    },

    init: function () {

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

