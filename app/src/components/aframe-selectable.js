import 'aframe-animation-component';

var AFRAME = require('aframe');
var utils = AFRAME.utils;
var bind = utils.bind;



AFRAME.registerComponent('selectable', {

    schema: {
        target: {type: 'string'}
    },

    init : function () {
        this.bindMethods();
        this.onClick();
        },

    bindMethods: function () {
        this.onClick = bind(this.onClick, this);
    },

    onClick: function(){
        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;

        elem.addEventListener('click', function(evt) {
            var actualScene = elem.parentElement;
            var targetID = "#" + target;
            var trg = sceneEl.querySelector(targetID);



           actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 4000; easing: linear; from: 1; to: 0;');
           trg.setAttribute('animation__appear', 'property: material.opacity; dur:4000; easing:linear; from: 0; to: 1;')


            //console.log(actualScene);
            /*
           var disappearAnimation = document.createElement('a-animation');
           disappearAnimation.setAttribute('attribute', 'material.opacity');
           disappearAnimation.setAttribute('dur', '4000');
           disappearAnimation.setAttribute('from', '1');
           disappearAnimation.setAttribute('to', '0');
           disappearAnimation.setAttribute('easing', 'linear'); */

            /*var appearAnimation = document.createElement('a-animation');
            appearAnimation.setAttribute('attribute', 'opacity');
            appearAnimation.setAttribute('dur', '4000');
            appearAnimation.setAttribute('from', '0');
            appearAnimation.setAttribute('to', '1');
            appearAnimation.setAttribute('easing', 'linear');*/

            //actualScene.appendChild(disappearAnimation);
            //trg.appendChild(appearAnimation);
            //sceneEl.querySelector(targetID).setAttribute('visible', true);
        })
    }
});