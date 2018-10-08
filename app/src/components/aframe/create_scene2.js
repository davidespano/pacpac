//import Transition from "../../interactives/Transition";
//import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
//import {Curved, Sound} from './aframe-entities';
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import PlanarScene from './PlanarScene'
import SceneAPI from "../../utils/SceneAPI";

export default class VRScene extends React.Component {

    constructor(props) {
        super(props);
        let scene = this.props.scenes.toArray()[0];
        let gameGraph = {};
        this.state = {
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene.img,
        };
        document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {
        this.loadEverything();
    }

    async loadEverything() {
        let scene = this.props.scenes.toArray()[0];
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene.img,
        });
    }

    handleSceneChange(newActiveScene) {
        const index = newActiveScene + '.mp4';
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: this.state.graph,
            activeScene: index                  
        });

    }

    render() {
        let skies = [];
        if (this.state.graph.neighbours !== undefined) {
            if (this.state.graph.neighbours[this.state.activeScene] !== undefined) {
                let currentLevel = Object.keys(this.state.graph.scenes).filter(name =>
                    this.state.graph.neighbours[this.state.activeScene].includes(name) || name === this.state.activeScene);
                skies = currentLevel.map((sky) => {

                    let mats;
                    let curvedImages = [];

                    let scene = this.state.graph.scenes[sky];
                    if (sky === this.state.activeScene) {
                        curvedImages = scene.transitions;
                        mats = "opacity: 1; visible: true";
                    }
                    else mats = "opacity: 0; visible: false";
                    return (
                        <Bubble key={"key" + scene.name} name={scene.name} img={scene.img} material={mats}
                                transitions={curvedImages}
                                handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>
                    );
                })
            }
        }
        return (
            <div id="mainscene">
                <Scene stats>
                    {skies}
                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor" pointsaver/>
                        </Entity>
                    </Entity>;
                </Scene>
            </div>
        )
    }
}






















