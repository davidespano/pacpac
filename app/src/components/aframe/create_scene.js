import Transition from "../../interactives/Transition";
import Scene from "../../scene/MyScene";
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');

function curvedImageFact(transitions)
{
    var curvedContainer = [];

    transitions.forEach(trans =>
    {
        var event = <a-curvedimage id={"curv" + trans.rules.target} rotation={trans.rotation} radius = "9.5" theta-length={trans.theta}
                                                                       height={trans.height} selectable={'target:' + trans.rules.target}></a-curvedimage>

        curvedContainer.push(event);
    });

    return curvedContainer;
}

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
        var cursor = sceneEl.querySelector('#cursor');
        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents: startTransition'+actualScene.id + 'dis');
        trg.setAttribute('animation__appear', 'property: material.opacity; dur:2000; easing:linear; from: 0; to: 1; startEvents: startTransition' + target + 'app');

        elem.addEventListener('mouseenter',function () {
            cursor.setAttribute('color', 'green');
        });
        elem.addEventListener('mouseleave',function () {
            cursor.setAttribute('color', 'black');
        });

        elem.addEventListener('click', function (evt) {

            //Per il futuro: Settarla visible prima di fare il dispatch dell'event!
            var startEvent = new CustomEvent('startTransition' + actualScene.id + 'dis');
            var arriveEvent = new CustomEvent('startTransition' + target + 'app');
            actualScene.dispatchEvent(startEvent);
            trg.dispatchEvent(arriveEvent);
            //addEventListeners(trg,'animationbegin', enableChild(trg, target));
            //addEventListeners(actualScene, 'animationbegin', disableChild(actualScene));

            //removeEventListeners(trg, 'animationbegin', enableChild);
            //removeEventListeners(actualScene, 'animationbegin', disableChild);
        });
    }
});

function sceneFactory()
{
    var sceneList = [];

    var scene1 = new Scene("bolla1.jpg");
    var tr1 = new Transition('', 2000, '0 -90 0');
    tr1.rules.target='bolla2';
    //var tr2 = new Transition('', 2000, '0 0 0');
    //tr2.rules.target='bolla2';
    var tr4 = new Transition('', 2000, '0 180 0');

    scene1.transitions.push(tr1);
    //scene1.transitions.push(tr2);
    sceneList.push(scene1);

    var scene2 = new Scene("bolla2.jpg");
    var tr3 = new Transition('', 2000, '0 90 0');
    tr3.rules.target='bolla1';
    scene2.transitions.push(tr3);
    sceneList.push(scene2);

    return sceneList;
}

function cameraCreator()
{
    var camera;
    var mouse;
    var cursor;

    cursor = <a-cursor id="cursor"></a-cursor>;
    mouse = <Entity mouse-cursor> {cursor} </Entity>;
    camera = <Entity camera look-controls_us="pointerLockEnabled: true">{mouse}</Entity>;

    return camera;
}

function bubbleCreator (factory)
{
    var scene = [];
    var skyContainer = [];
    var first = true;

    factory.forEach(scena =>
    {
        if(first)
        {
            first = false;
            var curved = curvedImageFact(scena.transitions);
            skyContainer.push(<a-sky key="prova" id={scena.name} src={"http://localhost:3000/media/" + scena.img} radius="10">
                {curved}
            </a-sky>);
        }
        else
            skyContainer.push(<a-sky key="prova" id={scena.name} src={"http://localhost:3000/media/" + scena.img} radius="10" visible="false"></a-sky>);
    });

    skyContainer.push(cameraCreator());
    scene.push(<a-scene>{skyContainer}</a-scene>);
    return scene;
}

export function sceneCreator()
{
   var factory = sceneFactory();
   var tables = bubbleCreator(factory);
   ReactDOM.render(tables, document.getElementById("mainscene"));
}

/*function enableChild (trg, target) {

    trg.setAttribute('visible', true);
    var sceneEl = document.querySelector('a-scene');
    var bubble = sceneEl.querySelector('#'+target);
    var entity = map.get(target)
    if(entity instanceof Array){
        for(var i=0;i<entity.length;i++){
            curvedImage(bubble, entity[i].rules.target, entity[i].rotation, '9.5', entity[i].theta, true)
        }
    } else {
        if(entity != null)
            curvedImage(bubble, entity.rules.target, entity.rotation, '9.5', entity.theta, true)
    }
}*/

function disableChild(actualScene) {

    var childrenList = actualScene.children;
    var children = childrenList.length;

    for(var i=0; i<children; i++) {
        actualScene.removeChild(childrenList[0]);
    }
    actualScene.setAttribute('visible', false);

}

function addEventListeners (el, eventName, handlers) {
    var handler;
    var i;

    if (!handlers) { return; }

    // Convert to array.
    if (handlers.constructor === Function) { handlers = [handlers]; }

    // Register.
    for (i = 0; i < handlers.length; i++) {
        el.addEventListener(eventName, handlers[i]);
    }
}

function removeEventListeners (el, eventName, handlers) {
    var handler;
    var i;

    if (!handlers) { return; }

    // Convert to array.
    if (handlers.constructor === Function) { handlers = [handlers]; }

    // Unregister.
    for (i = 0; i < handlers.length; i++) {
        el.removeEventListener(eventName, handlers[i]);
    }
}

