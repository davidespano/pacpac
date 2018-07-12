import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import './aframe-selectable'
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');
var factory = sceneFactory();

function curvedImageFact(transitions)
{
    var curvedContainer = [];

    transitions.forEach(trans =>
    {
        var event = <Entity primitive="a-curvedimage" key={"keyC"+ trans.rules.target} id={"curv" + trans.rules.target} rotation={trans.rotation} radius = "9.5" theta-length={trans.theta}
                                                                       height={trans.height} selectable={'target:' + trans.rules.target}/>

        curvedContainer.push(event);
    });

    return curvedContainer;
}


function sceneFactory()
{
    var sceneList = [];

    var scene1 = new MyScene("bolla1.jpg");
    var tr1 = new Transition('', 2000, '0 -90 0');
    tr1.rules.target='bolla2';
    var tr2 = new Transition('', 2000, '0 0 0');
    tr2.rules.target='bolla3';


    scene1.transitions.push(tr1);
    scene1.transitions.push(tr2);
    sceneList.push(scene1);

    var scene2 = new MyScene("bolla2.jpg");
    var tr3 = new Transition('', 2000, '0 90 0');
    tr3.rules.target='bolla1';
    scene2.transitions.push(tr3);
    sceneList.push(scene2);

    var scene3 = new MyScene("bolla3.jpg");
    var tr4 = new Transition('', 2000, '0 180 0');
    tr4.rules.target= 'bolla1';
    scene3.transitions.push(tr4);
    sceneList.push(scene3);

    return sceneList;
}

function cameraCreator()
{
    var camera;
    var mouse;
    var cursor;

    cursor = <Entity primitive="a-cursor" id="cursor"></Entity>;
    mouse = <Entity mouse-cursor> {cursor} </Entity>;
    camera = <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">{mouse}</Entity>;

    return camera;
}

function bubbleCreator (factory)
{
    var scene;
    var skyContainer = [];
    var first = true;

    factory.forEach(scena =>
    {
        if(first)
        {
            first = false;
            var curved = curvedImageFact(scena.transitions);
            skyContainer.push(<Entity primitive="a-sky" key={"key" + scena.name} id={scena.name} src={"http://localhost:3000/media/" + scena.img} radius="10">
                {curved}
            </Entity>);
        }
        else
            skyContainer.push(<Entity primitive="a-sky" key={"key" + scena.name} id={scena.name} src={"http://localhost:3000/media/" + scena.img} radius="10" material = "opacity: 0"></Entity>);
    });

    skyContainer.push(cameraCreator());
    scene = <Scene>{skyContainer}</Scene>;
    return scene;
}

export function sceneCreator()
{
   var tables = bubbleCreator(factory);
   ReactDOM.render(tables, document.getElementById("mainscene"));
}

export function enableChild(trg)
{
    var element = factory.find(el => el.name == trg.id)

    if(element != null)
    {
        ReactDOM.render(curvedImageFact(element.transitions), trg);
    }
}

export function disableChilds(actualScene)
{
    ReactDOM.render([], actualScene);
}


