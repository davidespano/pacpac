import 'aframe';
import './aframe_selectable'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../interactives/rules/ConditionUtils";
import {executeAction} from "./aframe_actions";
import settings from "../../utils/settings";
const THREE = require('three');
const eventBus = require('./eventBus');
const {mediaURL} = settings;

export default class VRScene extends React.Component {

    constructor(props) {
        super(props);
        let scene = this.props.scenes.toArray()[0];
        let gameGraph = {};
        this.state = {
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            rulesAsString: "[]"
        };
        this.currentScene = React.createRef();
        document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {
        this.loadEverything();
    }

    async loadEverything() {

        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        let scene = gameGraph['scenes'][this.state.activeScene.img];
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
        });
        this.createRuleListeners();
    }

    createRuleListeners(){
        let me = this;

        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {
            eventBus.on('click-'+rule.object_uuid, function () {
                if(ConditionUtils.evalCondition(rule.condition)){
                    rule.actions.forEach(action => executeAction(me.state, rule, action))
                }
            })
        })
    }

    handleSceneChange(newActiveScene) {
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: this.state.graph,
            activeScene: this.state.graph.scenes[newActiveScene]
        });

    }

    render() {
        let skies = [];
        if (this.state.graph.neighbours !== undefined) {
            if (this.state.graph.neighbours[this.state.activeScene.img] !== undefined) {
                let currentLevel = Object.keys(this.state.graph.scenes).filter(name =>
                    this.state.graph.neighbours[this.state.activeScene.img].includes(this.state.graph.scenes[name].name)
                    || name === this.state.activeScene.img);
                var assets = [];
                skies = currentLevel.map((sky) => {

                    let mats = "";
                    let active = 'active: false;';
                    let curvedImages = [];
                    let scene = this.state.graph.scenes[sky];

                    if (sky === this.state.activeScene.img) {
                        curvedImages = Object.values(scene.objects).flat();
                        curvedImages.forEach(obj => {
                                if(obj.media !== ""){
                                    mats = "shader:multi-video;";
                                    assets.push(
                                        <video id={"media_" + obj.uuid} src={`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.media}
                                               loop={"false"} crossorigin="anonymous" muted/>
                                    )
                                }
                                if(obj.mask !== ""){
                                    assets.push(
                                        <a-asset-item id={"mask_" + obj.uuid} crossorigin="Anonymous"  preload="auto" src={`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.mask}/>
                                    )
                                }
                            }
                        );
                        mats += "opacity: 1; visible: true; ";
                        // shader:multi-video;
                        active = 'active: true; video: ' + scene.img;
                    }
                    else mats = "opacity: 0; visible: false";

                    assets.push(
                        <video key={"key" + scene.name} crossorigin={"anonymous"} id={scene.img} loop={"true"}  muted>
                            <source type="video/mp4" src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + scene.img} />
                        </video>
                    );

                    return (
                        <Bubble key={"key" + scene.name} name={scene.name} img={scene.img} material={mats}
                                transitions={curvedImages} handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                                videoName={active}/>
                    );
                })
            }
        }
        return (
            <div id="mainscene">
                <Scene stats>
                    <a-assets>
                        {assets}
                    </a-assets>
                    {skies}
                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor" pointsaver/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        )
    }

    componentDidUpdate(){
        let me = this;
        setTimeout(function () { //timeout to wait the render of the scene
            const scene = me.state.activeScene;
            const objs = Object.values(scene.objects).flat(); //all the objects, whatever type
            if(objs.length === 0) return; //shader not necessary

            let video = [];
            let masks = [];
            let aux = new THREE.VideoTexture(document.getElementById(scene.img)); //background video
            aux.minFilter = THREE.NearestFilter;
            video.push(aux);

            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                if(obj.media === "" || obj.mask === "") return;
                aux = new THREE.VideoTexture(document.getElementById("media_"+obj.uuid));
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);
                aux =  new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.mask);
                aux.minFilter = THREE.NearestFilter;
                masks.push(aux);
            });

            if(masks.length === 0) return; //shader not necessary

            //take the sky, set the shader
            let sky = document.getElementById(scene.name);
            sky.setAttribute('material', "shader:multi-video;");
            let childrenDimension = sky.object3D.children.length - 1;

            let i=0;
            let declarations = "";
            for(i=0; i<masks.length; i++){
                //for each of the mask and video add the variables in the uniforms field, and prepare a string for the fragment shader
                sky.object3D.children[childrenDimension].material.uniforms[`video${i}`] = {type: "t", value: video[i]};
                sky.object3D.children[childrenDimension].material.uniforms[`mask${i+1}`] = {type: "t", value: masks[i]};
                declarations += `
                       uniform sampler2D video${i};    uniform sampler2D mask${i+1};`;

            }
            //the last video is not handled by the previous loop
            sky.object3D.children[childrenDimension].material.uniforms[`video${i}`] = {type: "t", value: video[i]};
            declarations += `   uniform sampler2D video${i};`;

            //now prepare the mixfunction for the fragment shader
            let mixFunction = "mix(texture2D(video0,vUv),texture2D(video1, vUv),texture2D(mask1, vUv).y)";
            for(i=2; i<video.length; i++){
                mixFunction = `mix(${mixFunction},texture2D(video${i}, vUv),texture2D(mask${i}, vUv).y)`
            }
            mixFunction = `vec4(${mixFunction});`;

            //now set the fragment shader and other small things
            let fragShader =
            `
                precision mediump int;
                precision mediump float;
                
                varying vec2 vUv;
                ${declarations}
                uniform float opacity;
                
                void main() {
                
                gl_FragColor = ${mixFunction}
                gl_FragColor.a = opacity;
                
                }
        `;
            sky.object3D.children[childrenDimension].material.fragmentShader = fragShader;
            sky.object3D.children[childrenDimension].material.needsUpdate = true;
            //console.log(sky.object3D.children[childrenDimension].material);

            document.getElementById(scene.img).play();
            document.getElementById("media_"+objs[0].uuid).play();
        }, 50)
    }
}






















