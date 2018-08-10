import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
import './aframe-newGeometry'
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');
var THREE = require('three');

function Curved(props)
{
    return(
        <Entity geometry={"primitive: mygeo; vertices: " + props.vertices} scale= "-1 1 1" material="side: double; opacity: 0.50"/>
    );
}

class Bubble extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved vertices={curve.vertices}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10">
                {curves}
            </Entity>
        );
    }
}

export function givePoints(props)
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.getAttribute("pointsaver").points;

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );

    //Trovare un modo per farsi passare la transizione dall'editor
    console.log( props.currentObject.object.vertices);
    props.currentObject.object.vertices = puntisalvati.join();
    console.log( props.currentObject.object.vertices);
   // let tr = new Transition('', 2000, '0 -90 0', '', '', 10, 2, puntisalvati.join());
    //fact[0].transitions.push(props.currentObject.object);
}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            scenes: this.props.currentScene,
        };
    }

    handleSceneChange()
    {
        this.setState({
            scenes: this.props.currentScene
        })
    }

    handleFeedbackChange() {
        if(document.querySelector('#cursor').getAttribute('pointsaver') != null) {
            let a_point = document.querySelector('#cursor').getAttribute('pointsaver').points;

            //Punti
            let length = a_point.length;
            let idPoint = "point" + (length - 1).toString();
            let tmp = document.createElement('a-entity');
            tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('id', idPoint);
            tmp.setAttribute('material', 'color: green; shader: flat');
            tmp.setAttribute('class', 'points');
            document.querySelector('a-sky').appendChild(tmp);


            //Linee, purtroppo è poco intuitivo.
            /*
            console.log(a_point.length);
            let length = a_point.length;
            if (length >= 2) {
                let tmp = document.createElement('a-entity');
                tmp.setAttribute('scale', '-1 1 1');
                tmp.setAttribute('line', 'start: ' + a_point[(length - 2)].toArray().join(" "));
                tmp.setAttribute('line', 'end: ' + a_point[(length - 1)].toArray().join(" "));
                document.querySelector('a-sky').appendChild(tmp);
            }
            */
        }
    }

    componentDidMount () {
        console.log(document.querySelector('#mainscene'));
        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            console.log("ciao");
            const keyName = event.key;
            if(keyName === 's' || keyName === 'S')
            {
                let pointsaver = document.querySelector('#cursor').getAttribute('pointsaver');
                if(pointsaver != null && pointsaver.points.length != 0) {
                    let cursor = document.querySelector('#cursor');
                    givePoints(this.props);
                    this.handleSceneChange();
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange);
                    cursor.removeAttribute("pointsaver");
                    let scene = document.querySelector("a-sky");
                    let removeSphere = scene.querySelectorAll(".points");
                    removeSphere.forEach(point => {
                        scene.removeChild(point);
                    });
                    this.props.updateCurrentObject(this.props.currentObject.object, this.props.currentObject.type);
                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E')
            {
                let cursor = document.querySelector('#cursor');
                cursor.setAttribute('pointsaver', true);
                cursor.addEventListener('click', this.handleFeedbackChange);
            }

            if(keyName === 'u' || keyName === 'U')
            {
                let pointsaver = document.querySelector('#cursor').getAttribute('pointsaver');
                if(pointsaver != null && pointsaver.points.length != 0){
                    let points = pointsaver.points;
                    let lastID = points.length - 1;
                    let scene = document.querySelector('a-sky');
                    let lastChild = scene.querySelector('#point' + lastID.toString());
                    points.splice(-1);
                    scene.removeChild(lastChild);
                }
            }
        });
    }

    render()
    {
        let sky = this.state.scenes;
        let curvedImages = [];
        curvedImages = sky.transitions;

        let skies = <Bubble key={"key" + sky.name} name={sky.name} img={`${window.localStorage.getItem("gameID")}/` + sky.img} transitions={curvedImages} handler={() => this.handleSceneChange()}/>

        return(
            <div id="mainscene" tabIndex="0">
                <button style={{"zIndex": "99999", "position": "absolute"}} onClick={() => this.props.switchToEditMode()}>EDIT</button>

                <Scene>
                    {skies}


                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor"></Entity>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }
}
//Aggiungere due text, button, qualcosa che indichi all'utente come utilizzare salvataggio e edit.
//Meglio non usare le linee, usa semplicemente i punti che indicano come fare

