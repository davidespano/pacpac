import 'aframe-animation-component';

var AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {

    schema: {
        target: {type: 'string'}

        },

    init : function () {

        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        var actualScene = elem.parentElement;
        var targetID = "#" + target;
        var trg = sceneEl.querySelector(targetID);

        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 1000; easing: linear; from: 1; to: 0; startEvents: startTransition');
        trg.setAttribute('animation__appear', 'property: material.opacity; dur:1000; easing:linear; from: 0; to: 1; startEvents: startTransition');

        elem.addEventListener('click', function (evt) {
            //Per il futuro: Settarla visible prima di fare il dispatch dell'event!
            var currentEvent = 'startTransition';
            var e = new CustomEvent(currentEvent);

            actualScene.dispatchEvent(e);
            trg.dispatchEvent(e);
        });

        trg.addEventListener('animationbegin', function (evt) {
            var childrenList = trg.children;

            //Non è possibile usare il foreach con un HtmlCollection
            for(var i=0; i<childrenList.length; i++)
            {
                childrenList[i].setAttribute('visible', true);
            }
            trg.setAttribute('visible', 'true');

        });

        actualScene.addEventListener('animationcomplete', function (evt)
        {
            var childrenList = actualScene.children;

            for(var i=0; i<childrenList.length; i++)
            {
                childrenList[i].setAttribute('visible', false);
            }
            actualScene.setAttribute('visible', false);
        });
    }
});

