import 'aframe';
import './aframe_selectable'
import './pac-look-controls'
import './aframeUtils'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../interactives/rules/ConditionUtils";
import {executeAction} from "./aframe_actions";
import settings from "../../utils/settings";
import InteractiveObjectsTypes from '../../interactives/InteractiveObjectsTypes'
import "../../data/stores_utils";
import {ResonanceAudio} from "resonance-audio";
import stores_utils from "../../data/stores_utils";
import aframe_utils from "./aframe_utils"
import Values from '../../interactives/rules/Values';
import 'aframe-mouse-cursor-component';
import EditorState from "../../data/EditorState";
const THREE = require('three');
const eventBus = require('./eventBus');
const {mediaURL} = settings;

export default class DebugVRScene extends React.Component {

    constructor(props) {
        super(props);

        let scene = null;

        if(this.props.currentScene === null) {
            scene = this.props.scenes.toArray()[0];
        }else {
            scene = this.props.scenes.get(this.props.currentScene);
        }

        let gameGraph = {};
        this.state = {
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            rulesAsString: "[]",
            camera: {},
            resonanceAudioScene: {}
        };
        console.log(props)
        console.log(this.props.scenes.toArray()[0])
        //if(document.querySelector('link[href*="bootstrap"]'))
        //document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {
        let audioContext = new AudioContext();
        this.state.camera = new THREE.Vector3();
        this.loadEverything();
        this.generateRoom(audioContext);
        this.generateAudio(audioContext);
        //this.interval = setInterval(() => this.tick(), 200);
    }

    tick() {
        document.querySelector('#camera').object3D.getWorldDirection(this.state.camera);
        this.updateAngles();
    }

    async loadEverything() {

        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        let scene = gameGraph['scenes'][this.state.activeScene.uuid];
        let runState = this.createGameState(gameGraph);
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            runState: runState,
        });
        this.createRuleListeners();

        EditorState.gameGraph = this.state.graph;
        document.querySelector('#camera').removeAttribute('look-controls');
        document.querySelector('#camera').removeAttribute('wasd-controls');
    }

    createRuleListeners(){
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
        })
    }

    createGameState(gameGraph){
        let runState = {};
        Object.values(gameGraph.scenes).forEach(scene => {
            //create the state for the scene
            runState[scene.uuid] = {background: scene.img};
            //create the state for all the objs in the scene
            Object.values(scene.objects).flat().forEach(obj => {
                runState[obj.uuid] = {state: obj.properties.state}
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
        this.props.updateCurrentScene(this.state.activeScene.uuid);

    }

    cameraChangeMode(is3Dscene){
        let camera = document.getElementById('camera');
        let cursor = document.getElementById('cursor');
        let rayCastOrigin = is3Dscene?'cursor':'mouse';
        //TODO il controlli per il cambio camera vanno nella transizione
        //TODO verificare questo controllo, forse è fatto un po' a cazzo
        if(camera.getAttribute("pac-look-controls").pointerLockEnabled !== is3Dscene){
            camera.setAttribute("pac-look-controls", "planarScene: " + !is3Dscene);
            camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + is3Dscene);
            cursor.setAttribute('cursor', 'rayOrigin: ' + rayCastOrigin);
            document.querySelector('canvas').requestPointerLock();
            this.forceUpdate()
        } else {
            camera.setAttribute("pac-look-controls", "planarScene: " + is3Dscene);
            camera.setAttribute("pac-look-controls", "pointerLockEnabled:" + !is3Dscene);
            cursor.setAttribute('cursor', 'rayOrigin: ' + rayCastOrigin);
            document.querySelector('canvas').requestPointerLock()
            this.forceUpdate()
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

        //Assets generati qui non dal nuovo componente
        //let assets = this.generateAssets()

        let assets = this.generateAssets2();
        let is3dScene = this.state.activeScene.type===Values.THREE_DIM;
        let rayCastOrigin = is3dScene?'cursor':'mouse';
        //console.log(is3dScene)
        return (
            <a-scene embedded vr-mode-ui="enabled : false" background="color: black">
                <a-assets>
                    {assets}
                </a-assets>
                {this.generateBubbles()}

                <Entity primitive="a-camera" key="keycamera" id="camera"
                        pac-look-controls={"pointerLockEnabled: " + is3dScene.toString()+ ";planarScene:" + !is3dScene +";"}
                        look-controls="false" wasd-controls="false">
                    <Entity mouse-cursor>
                        <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: " + rayCastOrigin}
                                fuse={false} visible={is3dScene} raycaster="objects: [data-raycastable];"/>
                    </Entity>


                </Entity>
            </a-scene>
        )
    }

    generateAssets2(){
        return this.currentLevel.map(sceneName => {
            return aframe_utils.generateAsset(this.state.graph.scenes[sceneName],
                this.state.runState[sceneName].background, this.state.runState)
        }).flat();
    }
    generateAssets(){
        return this.currentLevel.map(sceneName => {
            let scene = this.state.graph.scenes[sceneName];
            let currAssets = [];
            let sceneBackground;
            //first, push the background media.
            if(stores_utils.getFileType(scene.img) === 'video'){
                sceneBackground = (
                    <video key={"key" + scene.name} crossOrigin={"anonymous"} id={scene.img} loop={"true"}  preload="auto"
                           src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + this.state.runState[scene.name].background}
                           playsInline={true} autoPlay muted={true}
                    />)
            } else {
                sceneBackground =(<img id={scene.img} key={"key" + scene.name} crossorigin="Anonymous"
                                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + this.state.runState[scene.name].background}
                />)
            }
            currAssets.push(sceneBackground);
            let objAsset;
            //second, push the media of the interactive objs
            Object.values(scene.objects).flat().forEach(obj => {
                Object.keys(obj.media).map(k => {
                    if(obj.media[k] !== null){
                        if(stores_utils.getFileType(obj.media[k]) === 'video'){
                            objAsset = (
                                <video key={k+"_" + obj.uuid} crossorigin={"anonymous"} id={k+"_" + obj.uuid} loop={"true"}  preload="auto"
                                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                                       playsInline={true} autoPlay muted={true}
                                />)
                        } else {
                            objAsset = (<img id={k+"_" + obj.uuid} key={k+"_" + obj.uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                            />)
                        }
                        currAssets.push(objAsset)
                    }
                });

                let v = this.generateCurrentAsset(obj);
                if(v!==null) currAssets.push(v);

                if(obj.mask !== "" && obj.mask !== undefined&& obj.mask !== null){
                    currAssets.push(
                        <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossorigin="Anonymous"
                                      preload="auto"
                                      src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.mask}
                        />
                    )
                }
            });
            scene.rules.forEach( rule => {
                rule.actions.forEach(action => {
                    if(action.action === 'CHANGE_BACKGROUND'){
                        if(stores_utils.getFileType(action.obj_uuid) === 'video'){
                            currAssets.push(
                                <video id={action.obj_uuid} key={"key" + action.obj_uuid}
                                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + action.obj_uuid}
                                       preload="auto" loop={'true'} crossorigin="anonymous" playsInline={true} muted={true}
                                />
                            )
                        } else {
                            currAssets.push(<img id={action.obj_uuid} key={"key" + action.obj_uuid} crossorigin="Anonymous"
                                                 src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + action.obj_uuid}
                            />)
                        }
                    }
                })

            });
            /*scene.audio.forEach( audio => {
                currAssets.push(<audio id="track" key={'track_'+this.state.activeScene.uuid} crossOrigin={"anonymous"}
                                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + 'four_channel_output.mp4'}
                                       preload="auto" onLoad={"this.generateAudio()"}/>)
            })*/
            /*currAssets.push(<audio id="track" key={'track_'+this.state.activeScene.uuid} crossOrigin={"anonymous"}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + 'four_channel_output.mp4'}
                                   preload="auto" onLoad={"this.generateAudio()"}/>)*/
            //third, push the media present in the actions
            //TODO do it! maybe not necessary
            scene.rules.forEach(()=>{});
            //return the assets
            return currAssets;
        }).flat();
    }

    generateCurrentAsset(obj){
        let currentAsset;
        switch (obj.type) {
            case InteractiveObjectsTypes.TRANSITION:
                if(obj.media.media0 !== null){
                    if(stores_utils.getFileType(obj.media.media0) === 'video'){
                        currentAsset = (
                            <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}
                                   preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}/>)
                    } else {
                        currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
                    }
                    return(currentAsset)
                }
                else return null;
            case InteractiveObjectsTypes.SWITCH:
                let i = (this.state.runState[obj.uuid].state === "OFF")?0:1;
                if(obj.media["media"+i] !== null){
                    if(stores_utils.getFileType(obj.media.media0) === 'video'){
                        currentAsset = (
                            <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}
                                   preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}
                            />)
                    } else {
                        currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}/>)
                    }
                    return(currentAsset)
                }
                else if (obj.media["media"+((i+1)%2)] !== null){
                    if(stores_utils.getFileType(obj.media.media0) === 'video'){
                        currentAsset = (
                            <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}
                                   preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}
                            />)
                    } else {
                        currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}/>)
                    }
                    return(currentAsset)
                }
                else return null;
            case InteractiveObjectsTypes.KEY:
                if(obj.media.media0 !== null){
                    if(stores_utils.getFileType(obj.media.media0) === 'video'){
                        currentAsset = (
                            <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}
                                   preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}/>)
                    } else {
                        currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
                    }
                    return(currentAsset)
                }
                else return null;
            default:
                return null;
        }
    }
    //cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
    generateBubbles(){
        return this.currentLevel.map(sceneName =>{
            let scene = this.state.graph.scenes[sceneName];
            return (
                <Bubble key={"key" + scene.name} scene={scene} isActive={scene.name === this.state.activeScene.name}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)} runState={this.state.runState}
                        editMode={false} cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
                />
            );
        });
    }

    generateRoom(audioContext){
        //TODO inserire scelta interno esterno
        let isInterior = false;
        let material = isInterior ? 'grass' : 'transparent';

        this.state.resonanceAudioScene = new ResonanceAudio(audioContext);
        this.state.resonanceAudioScene.output.connect(audioContext.destination);
        let roomDimensions = {
            width: 4,
            height: 4,
            depth: 4,
        };
        let roomMaterials = {
            // Room wall materials
            left: material,
            right: material,
            front: material,
            back: material,
            down: material,
            up: material,
        };
        this.state.resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);
    }

    generateAudio(audioContext){

        let audioElement = document.createElement('audio');

        //setTimeout(() => {
        //let audio=document.getElementById('track');
        //TODO add src from buble media
        audioElement.src = `${mediaURL}${window.localStorage.getItem("gameID")}/` + this.state.activeScene.img;
        audioElement.crossOrigin = 'anonymous';
        audioElement.load();
        audioElement.loop = true;
        let audioElementSource = audioContext.createMediaElementSource(audioElement);
        let source = this.state.resonanceAudioScene.createSource();
        audioElementSource.connect(source.input);
        //source.setPosition(0, 0, 0);
        //audioElement.play();
        //},50)


    }

    updateAngles() {
        let cameraMatrix4 = document.querySelector('#camera').object3D.matrixWorld
        this.state.resonanceAudioScene.setListenerFromMatrix(cameraMatrix4)

    }

}











