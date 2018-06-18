var AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {

    schema: {
        target: {type: 'string'}
    },

    init : function () {

        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        console.log(elem)
        /*var curv = sceneEl.querySelector('#curved');
        var template = sceneEl.querySelector('#templateBello');
        var template2 = sceneEl.querySelector('#templateBello2'); */


        /*curv.addEventListener('mouseenter', function (evt) {
            feedBackActivator.setAttribute('material', 'visible', true);
        });
        curv.addEventListener('mouseleave', function (evt) {
            feedBackActivator.setAttribute('material', 'visible', false);
        });*/

       /* curv.addEventListener('click', function(evt){
            template2.setAttribute('visible', true);
            template.setAttribute('visible', false);
            //feedBackActivator.disable();
        }); */

        elem.addEventListener('click', function(evt){
            console.log('diooooo')
            var actualScene = elem.parentElement;
            var targetID = "#"+target;

            actualScene.setAttribute('visible', false);
            sceneEl.querySelector(targetID).setAttribute('visible', true);

        });
    }
});
