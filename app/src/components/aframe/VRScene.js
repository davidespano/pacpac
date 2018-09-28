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
import Bubble from './Bubble';
const AFRAME = require('aframe');
const THREE = require('three');

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
            let mats;
            let curvedImages = [];

            if(index == this.state.activeScene)
            {
                curvedImages = sky.transitions;
                mats = "opacity: 1; visible: true";
            }
            else mats = "opacity: 0; visible: false";

            return(
                <Bubble key={"key" + sky.name} name={sky.name} img={sky.img} material={mats} transitions={curvedImages} handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>
            );
        });

        return(
            <div id="mainscene">

                <Scene stats>
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




















