import Transition from "../../interactives/Transition";
import Scene from "../../scene/MyScene";
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');
var factory = sceneFactory();

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

AFRAME.registerComponent('selectable',
{
    schema: {
        target:{type: 'string'}
    },

    init: function ()
    {
        var sceneEl = document.querySelector('a-scene');
        var elem = this.el;
        var target = this.data.target;
        var actualScene = elem.parentElement;
        var targetID = "#" + target;
        var trg = sceneEl.querySelector(targetID);
        var cursor = sceneEl.querySelector('#cursor');

        actualScene.setAttribute('animation__disappear', 'property: material.opacity; dur: 2000; easing: linear; from: 1; to: 0; startEvents:' + elem.id);
        trg.setAttribute('animation__appear', 'property: material.opacity; dur:2000; easing:linear; from: 0; to: 1; startEvents:' + elem.id);

        elem.addEventListener('mouseenter',function () {
            cursor.setAttribute('color', 'green');
        });
        elem.addEventListener('mouseleave',function () {
            cursor.setAttribute('color', 'black');
        });

        elem.addEventListener('click', function (evt) {
            var startEvent = new CustomEvent('' + elem.id);
            actualScene.dispatchEvent(startEvent);
            trg.dispatchEvent(startEvent);

            enableChild(trg);
            disableChilds(actualScene);

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
            skyContainer.push(<a-sky key="prova" id={scena.name} src={"http://localhost:3000/media/" + scena.img} radius="10" material = "opacity: 0"></a-sky>);
    });

    skyContainer.push(cameraCreator());
    scene.push(<a-scene>{skyContainer}</a-scene>);
    return scene;
}

export function sceneCreator()
{
   var tables = bubbleCreator(factory);
   ReactDOM.render(tables, document.getElementById("mainscene"));
}

function enableChild(trg)
{
    var element = factory.find(el => el.name == trg.id)

    if(element != null)
    {
        ReactDOM.render(curvedImageFact(element.transitions), trg);
    }
}

function disableChilds(actualScene)
{
    ReactDOM.render([], actualScene);
}


