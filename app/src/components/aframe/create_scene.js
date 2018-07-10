import Transition from "../../interactives/Transition";
import Scene from "../../scene/Scene";
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity} from 'aframe-react';

import InteractiveObject from "../../interactives/InteractiveObject";


var AFRAME = require('aframe');

let tr1 = new Transition('', 2000, '0 -90 0');
let tr2 = new Transition('', 2000, '0 0 0');
let tr3 = new Transition('', 2000, '0 90 0');
let tr4 = new Transition('', 2000, '0 180 0');
tr1.rules.target='bolla2';
tr2.rules.target='bolla4';
tr3.rules.target='bolla3';
tr4.rules.target='bolla1';
var transitions = [tr1, tr2];
let map = new Map();

/**
 * Register event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
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

/**
 * Unregister event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
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

AFRAME.registerComponent('create_scene', {


    init: function (){
        sceneCreator();
    }
    /*init : function () {
        sceneFactoryProv();
        //Cicleremo su tutti gli oggetti della scena(?)
        var sceneEl = document.querySelector('a-scene');
        var bolla1 = document.createElement('a-sky');
        var bolla2 = document.createElement('a-sky');
        var bolla3 = document.createElement('a-sky');
        var bolla4 = document.createElement('a-sky');

        map.set('bolla1', transitions);
        map.set('bolla2', tr3);
        map.set('bolla4', tr4);

        bolla1.setAttribute('src', 'http://localhost:3000/media/bolla1.jpg');
        bolla2.setAttribute('src', 'http://localhost:3000/media/bolla2.jpg');
        bolla3.setAttribute('src', 'http://localhost:3000/media/bolla3.jpg');
        bolla4.setAttribute('src', 'http://localhost:3000/media/bolla4.jpg');

        /*bolla1.setAttribute('src', 'http://192.168.0.221:3000/media/prova.mp4');
        bolla2.setAttribute('src', 'http://192.168.0.221:3000/media/prova2.mp4');
        bolla3.setAttribute('src', 'http://192.168.0.221:3000/media/bolla3.jpg');
        bolla4.setAttribute('src', 'http://192.168.0.221:3000/media/bolla4.jpg');*/

       /* bolla2.setAttribute('visible', 'false');
        bolla3.setAttribute('visible', 'false');
        bolla4.setAttribute('visible', 'false');

        bolla2.setAttribute('opacity', '0');
        bolla3.setAttribute('opacity', '0');
        bolla4.setAttribute('opacity', '0');

        bolla1.setAttribute('scale', '-1 1 1');
        bolla2.setAttribute('scale', '-1 1 1');
        bolla3.setAttribute('scale', '-1 1 1');
        bolla4.setAttribute('scale', '-1 1 1');

        bolla1.setAttribute('radius', '10');
        bolla2.setAttribute('radius', '10');
        bolla3.setAttribute('radius', '10');
        bolla4.setAttribute('radius', '10');

        bolla1.setAttribute('id', 'bolla1');
        bolla2.setAttribute('id', 'bolla2');
        bolla3.setAttribute('id', 'bolla3');
        bolla4.setAttribute('id', 'bolla4');

        //bolla1.setAttribute('curved','theta: 30; rotation: 0 -90 0; isSelectable: true; target: bolla2');
        //bolla1.setAttribute('curved','theta: 30; rotation: 0 -60 0; isSelectable: true; target: bolla4');
        //bolla2.setAttribute('curved','theta: 30; rotation: 0 0 0; isSelectable: true; target: bolla3');
        curvedImage(bolla1, 'bolla2', '0 -90 0', '9.5', '30', true);
        curvedImage(bolla1, 'bolla4', '0 0 0', '9.5', '30', true);
        //curvedImage(bolla2, 'bolla3', '0 90 0', '9.5', '30', true);
        //curvedImage(bolla4, 'bolla1', '0 180 0', '9.5', '30', true);


        sceneEl.appendChild(bolla1);
        sceneEl.appendChild(bolla2);
        sceneEl.appendChild(bolla3);
        sceneEl.appendChild(bolla4);
        */

    //}
});

function curvedImageFact(bolla, transitions, sel) {

    transitions.forEach(function(x){
        var event = document.createElement('a-curvedimage');
        event.setAttribute('id', 'curv' + x.rules.target);
        event.setAttribute('rotation', x.rotation);
        event.setAttribute('radius', '9.5');
        event.setAttribute('theta-length', x.theta);
        event.setAttribute('height', x.height);
        if(sel)
        {
            event.setAttribute('selectable', 'target: ' + x.rules.target)
            console.log("Pippo:" + x.rules.target);
        }

        bolla.appendChild(event);
    });
}

function curvedImage(bolla, target, rot, rad, theta, sel) {
    var event = document.createElement('a-curvedimage');
    event.setAttribute('id', 'curv'+target);
    event.setAttribute('rotation', rot);
    event.setAttribute('radius', rad);
    event.setAttribute('theta-length', theta);
    if(sel) {
        event.setAttribute('selectable', 'target: ' + target);
    }

    bolla.appendChild(event);
}



function foo(props){
    console.log("Dio " +props.ref)
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
            addEventListeners(trg,'animationbegin', enableChild(trg, target));
            addEventListeners(actualScene, 'animationbegin', disableChild(actualScene));

            removeEventListeners(trg, 'animationbegin', enableChild);
            removeEventListeners(actualScene, 'animationbegin', disableChild);


        });
    }
});


function enableChild (trg, target) {

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
}

function disableChild(actualScene) {

    var childrenList = actualScene.children;
    var children = childrenList.length;

    for(var i=0; i<children; i++) {
        actualScene.removeChild(childrenList[0]);
    }
    actualScene.setAttribute('visible', false);

}


function sceneFactoryProv()
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

function sceneCreator()
{
    var factory = sceneFactoryProv();
    var element;

    var sceneEl = document.querySelector('a-scene');
    var first = true;
    var array;
    var i=0;
    //Fallo diventare un bel foreach per cortesia
    //for(element in factory)
   // for(var i=0; i<factory.length; i++)
    //{
        //var bolla = document.createElement('a-sky');

         array = (<Entity geometry = {{primitive: 'a-sky'}} id={{id: factory[i].name}}  material={{src: 'http://localhost:3000/media/' + factory[i].img}}
            geometry ={{scale: '-1 1 1'}} radius = {{radius: 10}} />);
         console.log(array);
        /*bolla.setAttribute('primitive', 'a-sky');
        bolla.setAttribute('id', factory[i].name);
        bolla.setAttribute('src', 'http://localhost:3000/media/' + factory[i].img);
        bolla.setAttribute('scale', '-1 1 1');
        bolla.setAttribute('radius', '10');
        if(!first)
        {
            bolla.setAttribute('visible', false);
            bolla.setAttribute('opacity', '0');
        }
        else
        {
            curvedImageFact(bolla, factory[i].transitions, true);
            first = false;
        }*/

        ReactDOM.render(array, document.getElementById("mainscene"));
        //sceneEl.appendChild(bolla);
        console.log(sceneEl);
    //}

}













/*AFRAME.registerComponent('curved', {

    schema: {
        theta: {type: 'int'},
        rotation: {type: 'string'},
        isSelectable: {type: 'bool', default: false},
        target: {type: 'string', default: ''}
    },

    init : function () {

        var event = document.createElement('a-curvedimage');
        event.setAttribute('id', 'curv'+this.data.target);
        event.setAttribute('rotation', this.data.rotation);
        event.setAttribute('radius', '9.5');
        event.setAttribute('theta-length', this.data.theta);

        if(this.data.isSelectable) {
            event.setAttribute('selectable', 'target: ' + this.data.target);
        }

        this.el.appendChild(event);
    }
});*/
