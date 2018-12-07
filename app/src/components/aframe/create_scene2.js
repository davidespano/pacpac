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
        this.setShader = this.setShader.bind(this);
        this.state = {
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            rulesAsString: "[]"
        };
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

        if (this.state.graph.neighbours !== undefined && this.state.graph.neighbours[this.state.activeScene.img] !== undefined) {
                this.currentLevel = Object.keys(this.state.graph.scenes).filter(name =>
                    this.state.graph.neighbours[this.state.activeScene.img].includes(this.state.graph.scenes[name].name)
                    || name === this.state.activeScene.img);
        }
        else this.currentLevel = [];


        if (this.state.graph.neighbours !== undefined) {
            if (this.state.graph.neighbours[this.state.activeScene.img] !== undefined) {
                 let currentLevel = this.currentLevel;

                 skies = currentLevel.map((sky) => {

                     let mats = "depthTest: true; ";
                     let active = 'active: false;';
                     let curvedImages = [];
                     let scene = this.state.graph.scenes[sky];
                     let radius = 9.9;

                    curvedImages = Object.values(scene.objects).flat();
                    if (sky === this.state.activeScene.img) {
                        mats += "opacity: 1; visible: true;";
                        active = 'active: true; video: ' + scene.img;
                        radius = 10;
                    }
                    else mats += "opacity: 0; visible: false";

                    return (
                        <Bubble key={"key" + scene.name} name={scene.name} img={scene.img} material={mats}
                                transitions={curvedImages} handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                                videoName={active} radiusBubble={radius}/>
                    );
                })
            }
        }
        return (
            <div id="mainscene">
                <Scene stats>
                    <a-assets>
                        {this.generateAssets()}
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

    generateAssets(){
        return this.currentLevel.map(sceneName => {
            let scene = this.state.graph.scenes[sceneName];
            let currAssets = [];
            //first, push the background media.
            //TODO take the media from the state!
            currAssets.push(
                <video key={"key" + scene.name} crossorigin={"anonymous"} id={scene.img} loop={"true"}  preload="auto" muted>
                    <source type="video/mp4" src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + scene.img} />
                </video>);
            //second, push the media of the interactive objs
            Object.values(scene.objects).flat().forEach(obj => {
                    if(obj.media !== "" && obj.media !== undefined){
                        currAssets.push(
                            <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.media}
                                   preload="auto" loop={false} crossorigin="anonymous" muted
                            />
                        )
                    }
                    if(obj.mask !== "" && obj.mask !== undefined){
                        currAssets.push(
                            <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossorigin="Anonymous"
                                          preload="auto"
                                          src={`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.mask}
                            />
                        )
                    }
                }
            );
            //third, push the media present in the actions
            //TODO do it!
            scene.rules.forEach(()=>{});
            //return the assets
            return currAssets;
        }).flat();
    }

    componentDidUpdate(){
        //set the shader to all the existing bubble
        this.currentLevel.forEach(this.setShader);
    }

    setShader(sceneName){
        let me = this;
        if(sceneName === 'quarta.mp4') return;
        setTimeout(function () { //timeout to wait the render of the scene
            const scene = me.state.graph.scenes[sceneName];
            const objs = Object.values(scene.objects).flat(); //all the objects, whatever type
            if (objs.length === 0) return; //shader not necessary
            let sky = document.getElementById(scene.name);
            if(sky.getAttribute('material').shader === 'multi-video') return;
            let video = [];
            let masks = [];
            let aux = new THREE.VideoTexture(document.getElementById(scene.img)); //background video
            aux.minFilter = THREE.NearestFilter;
            video.push(aux);
            let dict = ['0'];
            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                if (obj.media === "" || obj.mask === "" || obj.media === undefined || obj.mask === undefined) return;
                aux = new THREE.VideoTexture(document.getElementById("media_" + obj.uuid));
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);
                aux = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/interactives/` + obj.mask);
                aux.minFilter = THREE.NearestFilter;
                masks.push(aux);
                dict.push(obj.uuid.replace(/-/g,'_'));
            });

            if (masks.length === 0) return; //shader not necessary

            //set the shader
            sky.setAttribute('material', "shader:multi-video;");
            let children = sky.object3D.children;
            let skyMesh = null;
            children.forEach(obj => {
                if (obj.type === "Mesh")
                    skyMesh = obj;
            });

            if (skyMesh == null) return;

            let i = 0;
            let declarations = "";
            for (i = 0; i < masks.length; i++) {
                //for each of the mask and video add the variables in the uniforms field, and prepare a string for the fragment shader
                skyMesh.material.uniforms[`video${dict[i]}`] = {type: "t", value: video[i]};
                skyMesh.material.uniforms[`mask${dict[i + 1]}`] = {type: "t", value: masks[i]};
                declarations += `
                           uniform sampler2D video${dict[i]};    uniform sampler2D mask${dict[i + 1]};`;

            }
            //the last video is not handled by the previous loop
            skyMesh.material.uniforms[`video${dict[i]}`] = {type: "t", value: video[i]};
            declarations += `   uniform sampler2D video${dict[i]};`;

            //now prepare the mixfunction for the fragment shader
            let mixFunction = `mix(texture2D(video0,vUv),texture2D(video${dict[1]}, vUv),texture2D(mask${dict[1]}, vUv).y)`;
            for (i = 2; i < video.length; i++) {
                mixFunction = `mix(${mixFunction},texture2D(video${dict[i]}, vUv),texture2D(mask${dict[i]}, vUv).y)`
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
            skyMesh.material.fragmentShader = fragShader;
            skyMesh.material.needsUpdate = true;
            //console.log(sceneName)
            //console.log(skyMesh.material.uniforms)
            //console.log(sky.object3D.children[childrenDimension].material);

            if (sceneName === me.state.activeScene.name) document.getElementById(scene.img).play();
        }, 50);
    }
}






















