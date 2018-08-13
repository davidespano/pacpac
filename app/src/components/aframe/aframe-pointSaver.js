var AFRAME = require('aframe');

AFRAME.registerComponent('pointsaver',
{
    schema:{
        points:{type: 'array', default: []}
    },

    init: function () {
        this.el.addEventListener('click', pointSaver);
    },
    
    remove: function () {
        let cursor = document.querySelector('#cursor');
        if(cursor)
            cursor.removeEventListener('click', pointSaver);
    }
});

function pointSaver(evt)
{
    let a_point = document.querySelector('#cursor').getAttribute('pointsaver').points;
    a_point.push(evt.detail.intersection.point);
}

