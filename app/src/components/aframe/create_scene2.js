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
        //SceneAPI.getAllDetailedScenes(gameGraph);
        //console.log(gameGraph)
        //SceneAPI.getByName(scene.img, scene);
        this.state = {                                  //forse aggiungerei le l'intorno corrente che aggiorno ogni volta, cosi sotto posso usare la funzione che già esiste
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene.img,
        };
    }

    componentDidMount() {
        this.loadEverything();
    }

    async loadEverything() {
        let scene = this.props.scenes.toArray()[0];
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        this.setState({
            scenes: this.props.scenes.toArray(), //dalla mappa si caricano solo i vicini e non tutte--non capisco perché è scene e non scenes--
            graph: gameGraph,
            activeScene: scene.img,                  //index non sarà più numerico ma il nome della scena corrente
        });
    }

    handleSceneChange(newActiveScene) {
        const index = newActiveScene + '.mp4';    //questo lo eliminerei
        //let scene = this.props.scenes.get(newActiveScene);                                      //prendo tutto dalla mappa usando il nome
        //SceneAPI.getByName(scene.img, scene);                                                   //questo non servirà più, avrò tutto
        this.setState({
            scenes: this.props.scenes.toArray(), //dalla mappa si caricano solo i vicini e non tutte--non capisco perché è scene e non scenes--
            graph: this.state.graph,
            activeScene: index                  //index non sarà più numerico ma il nome della scena corrente
        });

    }

    render() {
        if (this.state.graph.neighbours === undefined) {
            return (
                <div id="mainscene">

                    <Scene stats>

                        <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                            <Entity mouse-cursor>
                                <Entity primitive="a-cursor" id="cursor" pointsaver/>
                            </Entity>
                        </Entity>;
                    </Scene>
                </div>
            );
        } else {
            if (this.state.graph.neighbours[this.state.activeScene] !== undefined) {

                let currentLevel = Object.keys(this.state.graph.scenes).filter(name =>
                    this.state.graph.neighbours[this.state.activeScene].includes(name) || name === this.state.activeScene);
                let skies = currentLevel.map((sky) => {

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

            } else {
                return (
                    <div id="mainscene">

                        <Scene stats>

                            <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                                <Entity mouse-cursor>
                                    <Entity primitive="a-cursor" id="cursor" pointsaver/>
                                </Entity>
                            </Entity>;
                        </Scene>
                    </div>
                );
            }
        }
    }
}






















