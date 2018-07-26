var AFRAME = require('aframe');


AFRAME.registerComponent('pointsaver',
{
    schema:{
        points:{type: 'array', default: []}
    },

    init: function () {

        let a_point = this.data.points;

        this.el.addEventListener('click', function (evt) {
            console.log(a_point);
            a_point.push(evt.detail.intersection.point);
            console.log(evt.detail.intersection.point);
        });
    }
});