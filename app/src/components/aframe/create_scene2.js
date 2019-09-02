import 'aframe';
import './aframe_selectable'
import './pac-look-controls'
import './aframeUtils'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../rules/ConditionUtils";
import {executeAction} from "./aframe_actions";
import settings from "../../utils/settings";
import InteractiveObjectsTypes from '../../interactives/InteractiveObjectsTypes'
import "../../data/stores_utils";
import {ResonanceAudio} from "resonance-audio";
import stores_utils from "../../data/stores_utils";
import aframe_utils from "./aframe_assets";
import AudioAPI from "../../utils/AudioAPI";
import AudioManager from './AudioManager'
import Values from '../../rules/Values';
import 'aframe-mouse-cursor-component';
import ActionTypes from "../../actions/ActionTypes";
const soundsHub = require('./soundsHub');
const resonance = require('./Audio/Resonance');
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
            rulesAsString: "[]",
            camera: {},
        };
        //console.log(props)
        //console.log(props.assets.get(this.state.activeScene.img))
        //console.log(this.props.scenes.toArray())
        document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {

        this.state.camera = new THREE.Vector3();
        this.loadEverything();
        this.interval = setInterval(() => this.tick(), 100);
    }

    tick() {
        document.querySelector('#camera').object3D.getWorldDirection(this.state.camera);
        this.updateAngles();
    }

    async loadEverything() {


        this.setState({
            scenes: this.props.scenes.toArray(),
        });
        let audios = [];
        await AudioAPI.getAudios(audios);
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        let scene = gameGraph['scenes'][this.state.activeScene.uuid];
        let runState = this.createGameState(gameGraph);
        this.setState({
            graph: gameGraph,
            activeScene: scene,
            runState: runState,
            audios: audios,
        });

        this.createRuleListeners();
        document.querySelector('#camera').removeAttribute('look-controls');
        document.querySelector('#camera').removeAttribute('wasd-controls');
    }

    createRuleListeners(){
        let me = this;

        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {
            let duration = 0;
            let state = me.state;
            //let current_object = {};
            let objectVideo;
            /*Object.values(state.activeScene.objects).flat().forEach(o => {
                if (o.uuid === rule.event.obj_uuid) {
                    current_object = o;
                }
            });*/
            //let current_object = this.state.graph['objects'].get(rule.event.obj_uuid);
            console.log(rule.event)
            rule.actions.sort(stores_utils.actionComparator)
            if(rule.event.action === 'CLICK'){
                rule.actions.forEach(action => {
                    eventBus.on('click-' + rule.event.obj_uuid, function () {
                        if(ConditionUtils.evalCondition(rule.condition, me.state.runState)) {
                            setTimeout(function () {
                                executeAction(me, rule, action)
                            }, duration);
                            if(action.action === 'CHANGE_BACKGROUND'){
                                objectVideo = document.getElementById(action.obj_uuid);
                            } else {
                                objectVideo = document.querySelector('#media_' + action.obj_uuid);
                            }
                            if (objectVideo) {
                                duration = (objectVideo.duration * 1000);
                            }
                        }
                    })
                })
            }

        })
    }

    createGameState(gameGraph){
        let runState = {};
        Object.values(gameGraph.scenes).forEach(scene => {
            //create the state for the scene
            runState[scene.uuid] = {background: scene.img};
            //create the state for all the objs in the scene
            Object.values(scene.objects).flat().forEach(obj => {
                runState[obj.uuid] = {state: obj.properties.state,
                                      visible: obj.visible,
                                      step: obj.properties.step
                }
            });
        });

        return runState;
    }

    handleSceneChange(newActiveScene) {
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: this.state.graph,
            activeScene: this.state.graph.scenes[newActiveScene]
        });

    }

    cameraChangeMode(is3Dscene){
        let camera = document.getElementById('camera');
        let cursorMouse = document.getElementById('cursorMouse');
        let cursorEnity = document.getElementById('cursor');
        if(is3Dscene){
            camera.setAttribute("pac-look-controls", "planarScene: " + !is3Dscene);
            camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + is3Dscene);
            cursorMouse.setAttribute('raycaster', 'enabled: false');
            cursorEnity.setAttribute('raycaster', 'enabled: true');
            document.querySelector('canvas').requestPointerLock();
        } else {
            camera.setAttribute("pac-look-controls", "planarScene: " + is3Dscene);
            camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + !is3Dscene);
            cursorMouse.setAttribute('raycaster', 'enabled: true');
            cursorEnity.setAttribute('raycaster', 'enabled: false');
        }

    }

    render() {
        if (this.state.graph.neighbours !== undefined && this.state.graph.neighbours[this.state.activeScene.uuid] !== undefined) {
            this.currentLevel = Object.keys(this.state.graph.scenes).filter(uuid =>
                this.state.graph.neighbours[this.state.activeScene.uuid].includes(uuid)
                || uuid === this.state.activeScene.uuid);
        }
        else
            this.currentLevel = [];
        let assets = this.generateAssets();
        let is3dScene = this.state.activeScene.type===Values.THREE_DIM;
        return (
                <Scene stats background="color: black" >
                    <a-assets>
                        {assets}
                    </a-assets>
                    {this.generateBubbles()}

                    <Entity primitive="a-camera" key="keycamera" id="camera"
                            pac-look-controls={"pointerLockEnabled: " + is3dScene.toString()+ ";planarScene:" + !is3dScene +";"}
                            look-controls="false" wasd-controls="false">
                            <Entity primitive="a-cursor" id="cursorMouse" cursor={"rayOrigin: mouse" }
                                    fuse={false}   visible={false} raycaster={"objects: [data-raycastable]; enabled: " + !is3dScene + ";"}/>
                            <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: entity" }
                                    fuse={false}   visible={is3dScene} raycaster={"objects: [data-raycastable]; enabled: " + is3dScene + ";"}/>

                    </Entity>
                </Scene>
        )
    }

    generateAssets(){
        return this.currentLevel.map(sceneName => {
            return aframe_utils.generateAsset(this.state.graph.scenes[sceneName],
                this.state.runState[sceneName].background, this.state.runState, this.state.audios)
        }).flat();
    }

    generateBubbles(){
        return this.currentLevel.map(sceneName =>{
            let scene = this.state.graph.scenes[sceneName];
            return (
                <Bubble key={"key" + scene.name}
                        scene={scene}
                        isActive={scene.name === this.state.activeScene.name}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                        runState={this.state.runState}
                        editMode={false}
                        cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
                        audios={this.state.audios}
                        assetsDimention={this.props.assets.get(this.state.activeScene.img)}
                        isAudioOn={this.state.activeScene.isAudioOn}
                        debugMode={this.props.editor.mode === ActionTypes.DEBUG_MODE_ON}
                />
            );
        });
    }

    //TODO verificare che funzioni ancora la rotazione
    updateAngles() {
        let cameraMatrix4 = document.querySelector('#camera').object3D.matrixWorld
        resonance.default.setListenerFromMatrix(cameraMatrix4)

    }

}











