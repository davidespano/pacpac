import { registerComponent } from 'aframe'

var AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {

    init : function () {

        var sceneEl = document.querySelector('a-scene');
        var curv = sceneEl.querySelector('#curved');
        var template = sceneEl.querySelector('#templateBello');
        var template2 = sceneEl.querySelector('#templateBello2');


        /*curv.addEventListener('mouseenter', function (evt) {
            feedBackActivator.setAttribute('material', 'visible', true);
        });
        curv.addEventListener('mouseleave', function (evt) {
            feedBackActivator.setAttribute('material', 'visible', false);
        });*/

        curv.addEventListener('click', function(evt){
            template2.setAttribute('visible', true);
            template.setAttribute('visible', false);
            //feedBackActivator.disable();
        });
    }
});
