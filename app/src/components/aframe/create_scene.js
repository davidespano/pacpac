import Transition from "../../interactives/Transition";
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

AFRAME.registerComponent('create_scene', {

    init : function () {
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

        bolla2.setAttribute('visible', 'false');
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

    }
});

AFRAME.registerComponent('curved', {

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
});

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

            trg.addEventListener('animationbegin', enableChild(trg, target));
            actualScene.addEventListener('animationbegin', disableChild(actualScene));

            trg.removeEventListener('animationbegin', enableChild);
            actualScene.removeEventListener('animationbegin', disableChild);


        });
    }
});

function enableChild (trg, target) {

    trg.setAttribute('visible', true);
    var sceneEl = document.querySelector('a-scene');
    var bubble = sceneEl.querySelector('#'+target);
    var entity = map.get(target)
    if(entity instanceof Array){
        console.log(entity.length)
        for(var i=0;i<entity.length;i++){
            console.log(entity[i].rules.target)
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