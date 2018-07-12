import 'aframe-animation-component';
import {enableChild, disableChilds} from './create_scene';


var AFRAME = require('aframe');

AFRAME.registerComponent('selectable',
{
    schema: {
        target:{type: 'string'}
    },

    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        var actualScene = elem.parentElement;
        var targetID = "#" + target;
        var trg = sceneEl.querySelector(targetID);
        var cursor = sceneEl.querySelector('#cursor');

        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: ' + actualScene.id + "dis");
        trg.setAttribute('animation__appear', 'property: material.opacity; dur: 2000; easing: linear; from: 0; to: 1; startEvents: ' + trg.id + "app");

        elem.addEventListener('mouseenter', function () {
            cursor.setAttribute('color', 'green');
        });
        elem.addEventListener('mouseleave', function () {
            cursor.setAttribute('color', 'black');
        });

        elem.addEventListener('click', function (evt) {
            var disappear = new CustomEvent(actualScene.id + "dis");
            var appear = new CustomEvent(trg.id + "app");
            actualScene.dispatchEvent(disappear);
            trg.dispatchEvent(appear);

            trg.addEventListener("animationcomplete", function _listener(evt)
            {
                console.log("Animation");
                if(evt.detail.name == "animation__appear") enableChild(trg);

                trg.removeEventListener("animationcomplete", _listener);
                this.components[evt.detail.name].animation.reset();
            });

            disableChilds(actualScene);
        });
    }


});

