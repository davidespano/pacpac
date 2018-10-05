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

export default class VRScene extends React.Component{

    constructor(props)
    {
        super(props);
        let scene = this.props.scenes.toArray()[0];
        let gameGraph={};
        SceneAPI.getAllDetailedScenes(gameGraph);
        //SceneAPI.getByName(scene.img, scene);
        this.state = {                                  //forse aggiungerei le l'intorno corrente che aggiorno ogni volta, cosi sotto posso usare la funzione che già esiste
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene.img,
        };
    }

    handleSceneChange(newActiveScene)
    {
        console.log(newActiveScene)
        const index = newActiveScene + '.mp4';    //questo lo eliminerei
        let scene = this.props.scenes.get(newActiveScene);                                      //prendo tutto dalla mappa usando il nome
        SceneAPI.getByName(scene.img, scene);                                                   //questo non servirà più, avrò tutto
        let boh = this.state.graph.scenes
        console.log(boh)
        this.setState({
            scenes: this.props.scenes.toArray(), //dalla mappa si caricano solo i vicini e non tutte--non capisco perché è scene e non scenes--
            activeScene: index                  //index non sarà più numerico ma il nome della scena corrente
        });

    }

    render() {
        if(this.state.graph.neighbours === undefined) {
            return (
                <div id="mainscene">

                    <Scene stats>

                        {this.state.cameraType}
                    </Scene>
                </div>
            );
        } else {
            console.log(this.state.graph.neighbours[this.state.activeScene])
            //let skies = this.state.graph.neighbours[this.state.activeScene].forEach(sky =>
            let skies = this.state.scenes.map((sky) =>   //questo resterà pressochè identico, ma ciclo solo sull'intorno
            {
                //console.log(this.state.graph)
                let mats;
                let curvedImages = [];
                let sceneType;
                //let currentScene = this.state.graph.scenes[sky];
                //console.log(currentScene)
                if (sky.img === this.state.activeScene) {
                    curvedImages = sky.transitions;
                    mats = "opacity: 1; visible: true";
                }
                else {
                    mats = "opacity: 0; visible: false";

                }
                if (true) {
                    sceneType = <Bubble key={"key" + sky.name} name={sky.name} img={sky.img}
                                        material={mats} transitions={curvedImages} track={sky.tag.tagName}
                                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>;
                    this.state.cameraType =
                        <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                            <Entity mouse-cursor>
                                <Entity primitive="a-cursor" id="cursor" pointsaver/>
                            </Entity>
                        </Entity>;
                } else {
                    sceneType = <PlanarScene/>
                    this.state.cameraType =
                        <Entity key="keycamera" id="camera" camera="fov: 12" look-controls_us="enabled: false">
                            <Entity mouse-cursor>
                            </Entity>
                        </Entity>;
                }
                return (
                    sceneType
                );
            });

            return (
                <div id="mainscene">

                    <Scene stats>
                        {skies}


                        {this.state.cameraType}
                    </Scene>
                </div>
            );
        }
    }

}




















