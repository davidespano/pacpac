import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
//import 'aframe-chromakey-material';
import './aframe-selectable'
import {Curved} from './aframe-entities';
import React from 'react';
//import ReactDOM from 'react-dom';
import {Entity, Scene} from 'aframe-react';
//import InteractiveObject from "../../interactives/InteractiveObject";
//var AFRAME = require('aframe');

function createTransation(tr, target, theta){

    tr.rules.target=target;
    tr.height = 7;
    tr.theta = theta;
    tr.radius = 9;
}

function sceneFactory()
{
    var sceneList = [];

    var scene1 = new MyScene("prova.webm");
    var tr1 = new Transition('', 2000, '0 156 0');
    createTransation(tr1, 'bolla06', 50);
    scene1.transitions.push(tr1);
    scene1.tag.tagName='provaSound.mp3'
    sceneList.push(scene1);

    var scene2 = new MyScene("bolla06.mp4");
    var tr2 = new Transition('', 2000, '0 126 0');
    var tr12 = new Transition('', 2000, '0 306 0');
    createTransation(tr2, 'bolla10', 50);
    createTransation(tr12, 'bolla02', 50);
    scene2.transitions.push(tr2);
    scene2.transitions.push(tr12);
    sceneList.push(scene2);

    var scene3 = new MyScene("bolla10.mp4");
    var tr3 = new Transition('', 2000, '0 126 0');
    var tr13 = new Transition('', 2000, '0 306 0');
    createTransation(tr3, 'bolla15', 50);
    createTransation(tr13, 'bolla06', 50);
    scene3.transitions.push(tr3);
    scene3.transitions.push(tr13);
    sceneList.push(scene3);

    var scene4 = new MyScene("bolla15.mp4");
    var tr4 = new Transition('', 2000, '0 126 0');
    var tr7 = new Transition('', 2000, '0 36 0');
    var tr14 = new Transition('', 2000, '0 306 0');
    createTransation(tr4, 'bolla18', 50);
    createTransation(tr7, 'bolla19', 50);
    createTransation(tr14, 'bolla10', 50);
    scene4.transitions.push(tr4);
    scene4.transitions.push(tr7);
    scene4.transitions.push(tr14);
    sceneList.push(scene4);

    var scene5 = new MyScene("bolla19.mp4");
    var tr5 = new Transition('', 2000, '0 135 0');
    var tr11 = new Transition('', 2000, '0 233 0');
    createTransation(tr5, 'bolla22', 35);
    createTransation(tr11, 'bolla15', 35);
    scene5.transitions.push(tr5);
    scene5.transitions.push(tr11);
    sceneList.push(scene5);

    var scene6 = new MyScene("bolla18.mp4");
    var tr6 = new Transition('', 2000, '0 317 0');
    var tr9 = new Transition('', 2000, '0 85 0');
    createTransation(tr6, 'bolla15', 50);
    createTransation(tr9, 'bolla22', 35);
    scene6.transitions.push(tr6);
    scene6.transitions.push(tr9);
    sceneList.push(scene6);

    var scene7 = new MyScene("bolla22.mp4");
    var tr8 = new Transition('', 2000, '0 180 0');
    var tr10 = new Transition('', 2000, '0 25 0');
    createTransation(tr8, 'bolla19', 25);
    createTransation(tr10, 'bolla18', 35);
    scene7.transitions.push(tr8);
    scene7.transitions.push(tr10);
    sceneList.push(scene7);

    // var travel = new MyScene("travel.mp4")

    return sceneList;
}

class Bubble extends React.Component
{
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear")
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
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/2k/" + this.props.img} radius="10" material = {this.props.material} >
                {curves}
            </Entity>
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
        const index = this.state.scenes.findIndex(el => {return el.name === newActiveScene});

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

            if(index === this.state.activeScene)
            {
                curvedImages = sky.transitions;
                opacity = "opacity: 1";
            }
            else opacity = "opacity: 0";

            return(
                <Bubble key={"key" + sky.name} name={sky.name} img={sky.img} material={opacity} transitions={curvedImages} handler={ (newActiveScene) => this.handleSceneChange(newActiveScene) }/>
            );
        });

        return(
            <div id="mainscene">
                <button onClick={() => this.props.switchToEditMode()}>EDIT</button>
                <Scene stats>
                    {skies}

                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor"/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }

}




















