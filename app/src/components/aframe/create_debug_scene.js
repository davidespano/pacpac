import 'aframe';
import './aframe_selectable'
import './pac-look-controls'
import './aframeUtils'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../interactives/rules/ConditionUtils";
import interface_utils from "../interface/interface_utils"
import {executeAction} from "./aframe_actions";
import settings from "../../utils/settings";
import "../../data/stores_utils";
import {ResonanceAudio} from "resonance-audio";
import stores_utils from "../../data/stores_utils";
import aframe_utils from "./aframe_assets"
import Values from '../../interactives/rules/Values';
import 'aframe-mouse-cursor-component';
import EditorState from "../../data/EditorState";
import ActionTypes from "../../actions/ActionTypes";
import AudioAPI from "../../utils/AudioAPI";

const THREE = require('three');
const eventBus = require('./eventBus');
const {mediaURL} = settings;

export default class DebugVRScene extends React.Component {

    constructor(props) {
        super(props);

        let scene = null;

        if(this.props.currentScene){
            scene = this.props.scenes.get(this.props.currentScene);
        } else {
            if(this.props.scenes.size > 0){
                scene = this.props.scenes.toArray()[0];
            }
        }

        let gameGraph = {};
        this.state = {
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            rulesAsString: "[]",
            camera: {},
        };

        //if(document.querySelector('link[href*="bootstrap"]'))
        //document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {
        let audioContext = new AudioContext();
        this.state.camera = new THREE.Vector3();
        this.loadEverything();
        //this.generateRoom(audioContext);
        //this.generateAudio(audioContext);
        //this.interval = setInterval(() => this.tick(), 200);
    }

    tick() {
        document.querySelector('#camera').object3D.getWorldDirection(this.state.camera);
        this.updateAngles();
    }

    async loadEverything() {
        let audios = [];
        await AudioAPI.getAudios(audios);
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        let scene = gameGraph['scenes'][this.props.currentScene];
        let runState = this.createGameState(gameGraph);
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            runState: runState,
            audios: audios
        });
        this.createRuleListeners();

        EditorState.debugRunState = runState;

        document.querySelector('#camera').removeAttribute('look-controls');
        document.querySelector('#camera').removeAttribute('wasd-controls');
    }

    createRuleListeners() {
        let me = this;

        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {
            let duration = 0;
            let state = me.state;
            let current_object = {};
            let objectVideo;
            Object.values(state.activeScene.objects).flat().forEach(o => {
                if (o.uuid === rule.event.obj_uuid) {
                    current_object = o;
                }
            });
            rule.actions.sort(stores_utils.actionComparator)
            rule.actions.forEach(action => {
                eventBus.on('click-' + rule.event.obj_uuid, function () {
                    if (ConditionUtils.evalCondition(rule.condition, me.state.runState)) {
                        setTimeout(function () {
                            interface_utils.highlightRule(me.props, me.props.interactiveObjects.get(rule.event.obj_uuid));
                            if (me.props.currentObject === null)
                                executeAction(me, rule, action)
                        }, duration);
                        if (action.action === 'CHANGE_BACKGROUND') {
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
        })
    }

    createGameState(gameGraph) {
        let runState = {};
        Object.values(gameGraph.scenes).forEach(scene => {
            //create the state for the scene
            runState[scene.uuid] = {background: scene.img};
            //create the state for all the objs in the scene
            Object.values(scene.objects).flat().forEach(obj => {
                runState[obj.uuid] = {
                    state: obj.properties.state,
                    visible: obj.visible
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

        //Update current scene
        this.props.updateCurrentScene(this.state.graph.scenes[newActiveScene].uuid);

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
        if (this.state.graph.neighbours !== undefined && this.state.graph.neighbours[this.props.currentScene] !== undefined) {
            this.currentLevel = Object.keys(this.state.graph.scenes).filter(uuid =>
                this.state.graph.neighbours[this.props.currentScene].includes(uuid)
                || uuid === this.props.currentScene);
        } else
            this.currentLevel = [];

        //Assets generati qui non dal nuovo componente
        //let assets = this.generateAssets()

        if(this.state.activeScene) {

            let assets = this.generateAssets2();
            let is3dScene = this.props.scenes.get(this.props.currentScene).type === Values.THREE_DIM;

            return (
                <a-scene embedded vr-mode-ui="enabled : false" background="color: black">
                    <a-assets>
                        {assets}
                    </a-assets>
                    {this.generateBubbles()}

                    <Entity primitive="a-camera" key="keycamera" id="camera"
                            pac-look-controls={"pointerLockEnabled: " + is3dScene.toString() + ";planarScene:" + !is3dScene + ";"}
                            look-controls="false" wasd-controls="false">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursorMouse" cursor={"rayOrigin: mouse"}
                                    fuse={false} visible={false}
                                    raycaster={"objects: [data-raycastable]; enabled: " + !is3dScene + ";"}/>
                            <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: entity"}
                                    fuse={false} visible={is3dScene}
                                    raycaster={"objects: [data-raycastable]; enabled: " + is3dScene + ";"}/>
                        </Entity>
                    </Entity>
                </a-scene>
            )
        } else {
            return <a-scene background="color: white"></a-scene>
        }

    }

    generateAssets2() {
        return this.currentLevel.map(sceneName => {
            return aframe_utils.generateAsset(this.state.graph.scenes[sceneName],
                this.state.runState[sceneName].background, this.state.runState, this.state.audios)
        }).flat();
    }

    //cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
    generateBubbles() {
        return this.currentLevel.map(sceneName => {
            let scene = this.state.graph.scenes[sceneName];
            //this.props.currentObject !== null
            console.log(this.props.currentObject)
            console.log(this.props.currentScene)
            return (
                <Bubble currentScene={this.props.currentScene} onDebugMode={this.props.editor.mode === ActionTypes.DEBUG_MODE_ON}
                        key={"key" + scene.name} scene={scene} isActive={scene.uuid === this.props.currentScene}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                        runState={this.state.runState}
                        editMode={false} cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
                />
            );
        });
    }

    updateAngles() {
        let cameraMatrix4 = document.querySelector('#camera').object3D.matrixWorld
        this.state.resonanceAudioScene.setListenerFromMatrix(cameraMatrix4)
    }

}