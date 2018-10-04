import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
import {Curved, Sound} from './aframe-entities';
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
        //console.log(gameGraph);
        SceneAPI.getByName(scene.img, scene);
        this.state = {                                  //forse aggiungerei le l'intorno corrente che aggiorno ogni volta, cosi sotto posso usare la funzione che già esiste
            scenes: this.props.scenes.toArray(),
            activeScene: 0,
        };
    }

    handleSceneChange(newActiveScene)
    {
        const index = this.state.scenes.findIndex(el => {return el.name == newActiveScene});    //questo lo eliminerei
        let scene = this.props.scenes.get(newActiveScene);                                      //prendo tutto dalla mappa usando il nome
        SceneAPI.getByName(scene.img, scene);                                                   //questo non servirà più, avrò tutto
        this.setState({
            scenes: this.props.scenes.toArray(), //dalla mappa si caricano solo i vicini e non tutte--non capisco perché è scene e non scenes--
            activeScene: index                  //index non sarà più numerico ma il nome della scena corrente
        });
    }

    render() {
        let skies = this.state.scenes.map((sky, index) =>   //questo resterà pressochè identico, ma ciclo solo sull'intorno
        {
            let mats;
            let curvedImages = [];
            let sceneType;
            if(index === this.state.activeScene) {
                curvedImages = sky.transitions;
                mats = "opacity: 1; visible: true";
            }
            else {
                mats = "opacity: 0; visible: false";

            }
            if(true){
                sceneType = <Bubble key={"key" + sky.name} name={sky.name} img={sky.img}
                                    material={mats} transitions={curvedImages} track = {sky.tag.tagName }
                                    handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>;
                this.state.cameraType = <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true" >
                    <Entity mouse-cursor>
                        <Entity primitive="a-cursor" id="cursor" pointsaver/>
                    </Entity>
                </Entity>;
            } else {
                sceneType = <PlanarScene/>
                this.state.cameraType = <Entity key="keycamera" id="camera" camera="fov: 12"  look-controls_us="enabled: false" >
                                <Entity mouse-cursor>
                                </Entity>
                            </Entity>;
            }
            return(
                sceneType
            );
        });

        return(
            <div id="mainscene">

                <Scene stats>
                    {skies}


                    {this.state.cameraType}
                </Scene>
            </div>
        );
    }

}




















