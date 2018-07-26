import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
import './aframe-pointSaver'
import './aframe-newGeometry'
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');
var THREE = require('three');


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

function Curved(props)
{
    return(
        <Entity primitive="a-curvedimage" id={"curv" + props.target} rotation={props.rotation} radius = "9.5" theta-length={props.theta}
                height={props.height} selectable={'target:' + props.target}/>
    );
}

class Bubble extends React.Component
{
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name == "animation__appear")
            {
                el.props.handler(el.props.name)
            };

            this.components[evt.detail.name].animation.reset();
        });
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved key={"keyC"+ curve.rules.target} target={curve.rules.target} rotation={curve.rotation} theta={curve.theta} height={curve.height}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem}  primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10" material = {this.props.material}>
                {curves}
            </Entity>
        );
    }
}


function provaPunti()
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.getAttribute("pointsaver").points;

    let peppeio = document.querySelector("#rapeme");
    console.log("prova ftoString")
    console.log(JSON.stringify(puntisalvati));

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );


    peppeio.setAttribute('geometry', 'primitive: mygeo; vertices: ' + puntisalvati.join());

    /*
    let prova = new THREE.Geometry();
    console.log("puntiSalvati");
    console.log(puntisalvati);

    puntisalvati.forEach((punto) => {
        prova.vertices.push(punto);
    });

    console.log("Prova");
    console.log(prova);

    let facess = THREE.ShapeUtils.triangulateShape(prova.vertices, []);

    for( var i = 0; i < facess.length; i++){
        prova.faces.push( new THREE.Face3( facess[i][0], facess[i][1], facess[i][2]));
    }

    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var mesh = new THREE.Mesh(prova, material );

    console.log(mesh);

    let peppeio = document.querySelector("#rapeme");
    console.log(peppeio);
    */
    //peppeio.setAttribute('geometry', 'primitive: mesh');
}

class Prova extends React.Component
{

    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        this.nv.addEventListener("click", function clickListener(evt){
           provaPunti();
       });
    }

    render() {
        return (
            <Entity _ref={elem => this.nv = elem} id="rapeme" geometry="primitive: box" position="3 7 5"></Entity>
        );
    }
}

export default class VRScene extends React.Component{

    constructor(props)
    {
        super(props);
        const fact = sceneFactory();
        this.state = {
            scenes: fact,
            activeScene: 0,
        };
    }

    handleSceneChange(newActiveScene)
    {
        const index = this.state.scenes.findIndex(el => {return el.name == newActiveScene});

        this.setState({
            activeScene: index
        })
    }

    render()
    {
        let skies = this.state.scenes.map((sky, index) =>
        {
            let opacity;
            let curvedImages = [];

            if(index == this.state.activeScene)
            {
                curvedImages = sky.transitions;
                opacity = "opacity: 1";
            }
            else opacity = "opacity: 0";

            return(
                <Bubble key={"key" + sky.name} name={sky.name} img={sky.img} material={opacity} transitions={curvedImages} handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>
            );
        });

        return(
            <div id="mainscene">
                <button onClick={() => this.props.switchToEditMode()}>EDIT</button>

                <Scene>
                    {skies}
                    <Prova ></Prova>

                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor" pointsaver></Entity>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }
}




















