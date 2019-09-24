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
import EditorState from "../../data/EditorState";
import interface_utils from "../interface/interface_utils";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
const soundsHub = require('./soundsHub');
const resonance = require('./Audio/Resonance');
const THREE = require('three');
const eventBus = require('./eventBus');
const {mediaURL} = settings;


// [davide] teniamo dentro this.props.debug traccia del fatto che la scena sia creata
// da motore di gioco o per debug
// Ho l'impressione che l'attributo this.props.currentScene che viene dalla vecchia
// scena di debug e l'attributo this.props.activeScene possano essere unificati in un
// unico attributo. Non lo faccio per paura di fare danni, dopo la scuola estiva va fatto.
// Per il momento faccio dei test al momento della generazione dei componenti e popolo i
// parametri in base al flag di debug.

export default class VRScene extends React.Component {

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
            stats: false,
        };
        //console.log(props)
        //console.log(props.assets.get(this.state.activeScene.img))
        //console.log(this.props.scenes.toArray())
        if(!this.props.debug){
            document.querySelector('link[href*="bootstrap"]').remove();
        }
    }

    componentDidMount() {

        document.querySelector('#mainscene2').addEventListener('keydown', (event) => {
            const keyName = event.key;
            //Torno all'editor
            if(keyName === 'q' || keyName === 'Q') {
                //this.props.switchToEditMode();
            }
            //Attivo/Disattivo statistiche
            if(keyName === 's' || keyName === 'S') {
                let stats = !this.state.stats;
                this.setState({
                    stats: stats,
                });
            }
        });
        this.state.camera = new THREE.Vector3();
        this.loadEverything();

        this.interval = setInterval(() => this.tick(), 100);
    }

    tick() {
        //Aggiorno la rotazione della camera ogni n millisecondi
        let camera = document.querySelector('#camera');
        if(camera){
            camera.object3D.getWorldDirection(this.state.camera);
            this.updateAngles();
        }
    }

    async loadEverything() {

        this.setState({
            scenes: this.props.scenes.toArray(),
        });
        let audios = [];
        await AudioAPI.getAudios(audios, this.props.editor.gameId);
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph, this.props.editor.gameId);
        let runState = this.createGameState(gameGraph);

        let scene = null;
        if(!this.props.debug){
            // scene init for playing the game
            scene = gameGraph['scenes'][this.state.activeScene.uuid];
            let home = await SceneAPI.getHome(this.props.editor.gameId);
            if(home !== ''){
                scene = this.props.scenes.get(home);
            }
        }else{
            // scene init for debug purposes
            scene = gameGraph['scenes'][this.props.currentScene];
            EditorState.debugRunState = runState;
        }

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
            let objectVideo;
            rule.actions.sort(stores_utils.actionComparator)

            let actionCallback = function(action){
                // chiudo i parametri in modo che possa essere utilizzata come callback dal debug
                // senza passarli esplicitamente
                let closure = function() {
                    setTimeout(function () {
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
                };
                return closure;
            };

            switch (rule.event.action){
                case 'CLICK':
                    rule.actions.forEach(action => {
                        eventBus.on('click-' + rule.event.obj_uuid, function () {
                            if (ConditionUtils.evalCondition(rule.condition, me.state.runState)) {
                                // questa chiamata, come quelle di seguito, permette al debugger di
                                // evidenziare la regola eseguita e all'utente di premere esplicitamente il
                                // pulsante avanti per continuare.
                                let actionExecution = actionCallback(action);
                                if (me.props.debug) {
                                    setTimeout(function () {
                                        interface_utils.highlightRule(me.props, me.props.interactiveObjects.get(rule.event.obj_uuid));
                                        eventBus.on('debug-step', actionExecution);
                                    }, duration);
                                } else {
                                    actionExecution();
                                }


                            }
                        })
                    });
                    break;
                case 'IS':
                    let media;
                    //Controllo se il video è della scena o di un oggetto
                    //TODO bisognerebbe trovare un ID simile per tutti
                    if(document.getElementById(rule.event.subj_uuid))
                        media = document.getElementById(rule.event.subj_uuid)
                    if(document.getElementById(rule.event.uuid))
                        media =  media = document.getElementById('media_' + rule.event.uuid);
                    if(soundsHub["audios_"+ rule.event.subj_uuid] !== undefined){
                        media = soundsHub["audios_"+ rule.event.subj_uuid];
                    }

                    if(rule.event.obj_uuid === "ENDED" && media){
                        media.onended = function() {
                            rule.actions.forEach(action => {
                                if(ConditionUtils.evalCondition(rule.condition, me.state.runState)) {
                                    let actionExecution = actionCallback(action);
                                    if (me.props.debug) {
                                        setTimeout(function () {
                                            let object;
                                            if(me.props.interactiveObjects.get(rule.event.subj_uuid))
                                                object = me.props.interactiveObjects.get(rule.event.subj_uuid);
                                            else
                                                object = this.state.audios[rule.event.subj_uuid]
                                            interface_utils.highlightRule(me.props, object);
                                            eventBus.on('debug-step', actionExecution);
                                        }, duration);
                                    } else {
                                        actionExecution();
                                    }
                                }
                            });
                        };
                    }

                    if(rule.event.obj_uuid === "STARTED" && media){
                        media.onplay = function() {
                            rule.actions.forEach(action => {

                                if(ConditionUtils.evalCondition(rule.condition, me.state.runState)) {
                                    let actionExecution = actionCallback(action);
                                    if (me.props.debug) {
                                        setTimeout(function () {
                                            console.log('sto partendo')
                                            let object;
                                            if(me.props.interactiveObjects.get(rule.event.subj_uuid))
                                                object = me.props.interactiveObjects.get(rule.event.subj_uuid);
                                            else
                                                object = me.state.audios[rule.event.subj_uuid]
                                            interface_utils.highlightRule(me.props, object);
                                            eventBus.on('debug-step', actionExecution);
                                        }, duration);
                                    } else {
                                        actionExecution();
                                    }
                                }
                            });
                        };
                    }
                    break;
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

        if(this.props.debug){
            this.props.updateCurrentScene(this.state.graph.scenes[newActiveScene].uuid);
        }
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
        let sceneUuid = null;
        if(this.props.debug){
            sceneUuid = this.props.currentScene;
        }else{
            sceneUuid = this.state.activeScene.uuid;
        }
        if (this.state.graph.neighbours !== undefined && this.state.graph.neighbours[sceneUuid] !== undefined) {
            this.currentLevel = Object.keys(this.state.graph.scenes).filter(uuid =>
                this.state.graph.neighbours[sceneUuid].includes(uuid)
                || uuid === sceneUuid);
        }
        else
            this.currentLevel = [];
        let assets = this.generateAssets();
        let is3dScene = this.props.scenes.get(sceneUuid).type ===Values.THREE_DIM;
        var embedded = this.props.debug;
        var vr_mode_ui = this.props.debug ? "enabled : false": false;
        return (
            <div id="mainscene2" tabIndex="0">
                <Scene stats={!this.props.debug && this.state.stats} background="color: black" embedded={embedded} vr-mode-ui={vr_mode_ui}>
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
            </div>
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
            let currentScene = this.props.debug ? this.props.currentScene : false;
            let isActive = this.props.debug? scene.uuid === this.props.currentScene : scene.name === this.state.activeScene.name;
            return (
                <Bubble key={"key" + scene.name}
                        scene={scene}
                        currentScene={currentScene}
                        isActive={isActive}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                        runState={this.state.runState}
                        editMode={false}
                        cameraChangeMode={(is3D) => this.cameraChangeMode(is3D)}
                        audios={this.state.audios}
                        assetsDimention={this.props.assets.get(this.state.activeScene.img)}
                        isAudioOn={this.state.activeScene.isAudioOn}
                        onDebugMode={this.props.editor.mode === ActionTypes.DEBUG_MODE_ON}
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











