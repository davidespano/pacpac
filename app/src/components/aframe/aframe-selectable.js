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

        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: startTransition'+actualScene.id + 'dis');
        trg.setAttribute('animation__appear', 'property: material.opacity; dur:2000; easing:linear; from: 0; to: 1; startEvents: startTransition' + target + 'app');

        elem.addEventListener('click', function (evt) {


            //Per il futuro: Settarla visible prima di fare il dispatch dell'event!
            var startEvent = new CustomEvent('startTransition' + actualScene.id + 'dis');
            var arriveEvent = new CustomEvent('startTransition' + target + 'app');
            actualScene.dispatchEvent(startEvent);
            trg.dispatchEvent(arriveEvent);

            trg.addEventListener('animationbegin', enableChild(trg));
            actualScene.addEventListener('animationbegin', disableChild(actualScene));

            trg.removeEventListener('animationbegin', enableChild);
            actualScene.removeEventListener('animationbegin', disableChild);


        });
    }
});

function enableChild (trg) {
    var childrenList = trg.children;

    //Non è possibile usare il foreach con un HtmlCollection
    for(var i=0; i<childrenList.length; i++)
    {
        childrenList[i].setAttribute('visible', true);
    }
    trg.setAttribute('visible', true);

}

function disableChild(actualScene) {
    setTimeout(function () {
        var childrenList = actualScene.children;
        for(var i=0; i<childrenList.length; i++)
        {
            childrenList[i].setAttribute('visible', false);
        }
        actualScene.setAttribute('visible', false);
    },2000)

}