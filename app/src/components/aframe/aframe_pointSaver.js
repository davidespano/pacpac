var AFRAME = require('aframe');

AFRAME.registerComponent('pointsaver',
{
    schema:{
        points:{type: 'array', default: []},
        isCurved:{type: 'boolean', default: true},
        uuid:{type: 'string', default: ''}
    },

    init: function () {

        if(this.data.isCurved){
            this.el.addEventListener('click', pointSaverCurved);
        } else {
            this.el.addEventListener('click', pointSaverAudio);
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

