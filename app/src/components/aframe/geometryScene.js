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
const fact = sceneFactory();


function sceneFactory()
{
    //In questo caso bisognerà prendere la bolla attiva dall'editor(?)
    let sceneList = [];

    let scene1 = new MyScene("bolla1.jpg");
    let tr1 = new Transition('', 2000, '0 -90 0');
    tr1.rules.target='bolla2';
    let tr2 = new Transition('', 2000, '0 0 0');
    tr2.rules.target='bolla3';

    //scene1.transitions.push(tr1);
    //scene1.transitions.push(tr2);
    sceneList.push(scene1);

    return sceneList;
}

function Curved(props)
{
    console.log("Curved vertices");
    console.log(props.vertices);
    //Perchè non ti crei come dovresti??
    //Non viene attaccato selectable in questa scena. -Non ci sono altre bolle e non vogliamo che l'utente faccia transizioni per sbaglio
    return(
        <Entity geometry={"primitive: mygeo; vertices: " + props.vertices} scale= "-1 1 1" id={"curv" + props.target} material="side: double"/>
    );
}

function Edit(props)
{
    return(
        <Entity id="Edit" primitive="a-text" value="Edit" geometry="primitive: plane;" rotation="0 70 0" scale="-2.500 1 1" position=" -4 3 -3" material="color: black; opacity: 0.20" edit/>
    );

}

class Done extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener('click', function(evt){
            provaPunti();
            el.props.handler();
        });
    }

    render() {
        return (
            <Entity _ref={elem => this.nv = elem} id="Done" primitive="a-text" value="Done" geometry="primitive: plane;"
                    rotation="0 110 0" scale="-2.500 1 1" position=" -4 3 3" material="color: black; opacity: 0.20"
                    done/>
        );
    }
}


class Bubble extends React.Component
{
    constructor(props)
    {
        super(props);
        this.func = props.handler;
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved key={"keyC"+ curve.rules.target} vertices={curve.vertices} target={curve.rules.target} rotation={curve.rotation} theta={curve.theta} height={curve.height}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem}  primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10" material = {this.props.material}>
                <Edit />
                <Done handler={this.func}/>

                {curves}
            </Entity>
        );
    }
}

export function provaPunti()
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.getAttribute("pointsaver").points;

    console.log("Prima del splice");
    console.log(puntisalvati);
    puntisalvati.splice(-1, 1);
    console.log("After splice");
    console.log(puntisalvati);

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );

    let tr = new Transition('', 2000, '0 -90 0', '', '', 10, 2, puntisalvati.join());
    console.log(fact[0]);
    fact[0].transitions.push(tr);
    console.log(fact[0]);
}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            scenes: fact,
            activeScene: 0,
        };
    }

    handleSceneChange()
    {
        //Fa effettivamente qualcosa? React capisce che deve aggiungere roba? Strange.
        console.log("doing stuffs");
        console.log(this.state.scenes[0].transitions);
        console.log(this.state);
        this.setState({
            scenes: fact
        })

        console.log(this.state);
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
                <Bubble key={"key" + sky.name} name={sky.name} img={sky.img} material={opacity} transitions={curvedImages} handler={() => this.handleSceneChange()}/>
            );
        });

        return(
            <div id="mainscene">
                <button style={{"z-index": "99999", "position": "absolute"}} onClick={() => this.props.switchToEditMode()}>EDIT</button>

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