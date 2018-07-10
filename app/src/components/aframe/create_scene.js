import Transition from "../../interactives/Transition";
import Scene from "../../scene/Scene";
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from 'aframe-react';

import InteractiveObject from "../../interactives/InteractiveObject";


var AFRAME = require('aframe');

AFRAME.registerComponent('create_scene', {

    init: function (){
        sceneCreator();
    }
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


export function sceneCreator()
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

         //array = (<Entity geometry = {{primitive: 'a-sky'}} id={{id: factory[i].name}}  material={{src: 'http://localhost:3000/media/' + factory[i].img}}
           // geometry ={{scale: '-1 1 1'}} radius = {{radius: 10}} />);
         //console.log(array);
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

        function Sky(props) {

            console.log(props)
            return (<Scene>
                    <script type="type/javascript">
                        function skys(props) {
                        var  lenght = props.length;
                        for (var z = 0; z < lenght; z++) {
                        <a-sky id={props.name} src={'http://localhost:3000/media/bolla' + z +'.jpg'}/>

                        }
                    }
                    </script>
                    <script >
                        skys(props);


                    </script>
                        <a-sky id={props.name} src={'http://localhost:3000/media/bolla1.jpg'}/>
                        <Entity camera look-controls_us="pointerLockEnabled: true">
                            <Entity mouse-cursor>
                                <a-cursor id="cursor"></a-cursor>
                        </Entity>


                    </Entity>
                    </Scene>
            )
        }
        const pollo =<Sky props={factory[0]}/>;

        ReactDOM.render(pollo, document.getElementById("mainscene"));
    //}

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
}
*/
function disableChild(actualScene) {

    var childrenList = actualScene.children;
    var children = childrenList.length;

    for(var i=0; i<children; i++) {
        actualScene.removeChild(childrenList[0]);
    }
    actualScene.setAttribute('visible', false);

}
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

/*class Sky extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        console.log(this.props)
        return (<Entity geometry = {{primitive: 'a-sky'}} id={{id: this.props.name}}  material={{src: 'http://localhost:3000/media/' + this.props.img}}/>)
    }
}*/

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
