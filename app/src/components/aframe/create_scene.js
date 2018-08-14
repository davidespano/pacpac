import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
import './aframe-pointSaver'
import './aframe-newGeometry'
import SceneAPI from '../../utils/SceneAPI'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import InteractiveObject from "../../interactives/InteractiveObject";
var AFRAME = require('aframe');
var THREE = require('three');

function Curved(props)
{
    return(
        <Entity material="opacity: 0; visible: false; side: double" geometry={"primitive: mygeo; vertices: " + props.vertices} id={"curv" + props.target} selectable={'target:' + props.target} scale="-1 1 1"/>
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
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'opacity: 0.80');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');

                el.props.handler(el.props.name);
            }

            this.components[evt.detail.name].animation.reset();
        });
    }

    render()
    {
        const curves = this.props.transitions.map(curve =>
        {
            return(
                <Curved key={"keyC"+ curve.rules[0].actions[0].target} target={curve.rules[0].actions[0].target} vertices={curve.vertices}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem}  primitive="a-sky" id={this.props.name} src={"http://localhost:3000/media/" + this.props.img} radius="10" material={this.props.material}>
                {curves}
            </Entity>
        );
    }
}

export default class VRScene extends React.Component{

    constructor(props)
    {
        super(props);
        let scene = this.props.scenes.toArray()[0];
        SceneAPI.getByName(scene.img, scene);
        this.state = {
            scenes: this.props.scenes.toArray(),
            activeScene: 0,
        };
    }

    handleSceneChange(newActiveScene)
    {
        const index = this.state.scenes.findIndex(el => {return el.name == newActiveScene});
        let scene = this.props.scenes.get(newActiveScene);
        SceneAPI.getByName(scene.img, scene);
        this.setState({
            scene: this.props.scenes.toArray(),
            activeScene: index
        });
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
                <Bubble key={"key" + sky.name} name={sky.name} img={`${window.localStorage.getItem("gameID")}/` + sky.img} material={opacity} transitions={curvedImages} handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>
            );
        });

        return(
            <div id="mainscene">

                <Scene>
                    {skies}

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




















