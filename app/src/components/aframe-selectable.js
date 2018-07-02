import 'aframe-animation-component';

var AFRAME = require('aframe');

AFRAME.registerComponent('selectable', {

    schema: {
        target: {type: 'string'}

        },

    update : function () {

        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        var actualScene = elem.parentElement;
        var targetID = "#" + target;
        var trg = sceneEl.querySelector(targetID);
        //console.log(elem)
        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: startTransition'+actualScene.id);
        trg.setAttribute('animation__appear', 'property: material.opacity; dur:2000; easing:linear; from: 0; to: 1; startEvents: startTransition'+elem.id);
        console.log()
        elem.addEventListener('click', function (evt) {
            //Per il futuro: Settarla visible prima di fare il dispatch dell'event!
            var currentEventB = 'startTransition' + elem.id;
            var first = new CustomEvent(currentEventB);

            actualScene.dispatchEvent(first);
            trg.dispatchEvent(first);
        });

        trg.addEventListener('animationbegin', function (evt) {
            var childrenList = trg.children;

            //Non è possibile usare il foreach con un HtmlCollection
            for(var i=0; i<childrenList.length; i++)
            {
                childrenList[i].setAttribute('visible', true);
            }
            trg.setAttribute('visible', true);

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
    },


});

