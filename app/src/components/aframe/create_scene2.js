import 'aframe';
import './aframe_selectable'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../interactives/rules/ConditionUtils";
import {executeAction} from "./aframe_actions";
import settings from "../../utils/settings";
import InteractiveObjectsTypes from '../../interactives/InteractiveObjectsTypes'
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
        document.querySelector('link[href*="bootstrap"]').remove();
    }

    componentDidMount() {
        this.loadEverything();
    }

    async loadEverything() {

        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
        let scene = gameGraph['scenes'][this.state.activeScene.name];
        let runState = this.createGameState(gameGraph);
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: gameGraph,
            activeScene: scene,
            runState: runState,
        });
        this.createRuleListeners();
    }

    createRuleListeners(){
        let me = this;

        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {
            eventBus.on('click-'+rule.object_uuid, function () {
                if(ConditionUtils.evalCondition(rule.condition, me.state.runState)){
                    rule.actions.forEach(action => executeAction(me, rule, action))
                }
            })
        })
    }

    createGameState(gameGraph){
        let runState = {};
        Object.values(gameGraph.scenes).forEach(scene => {
            //create the state for the scene
            runState[scene.name] = {background: scene.img};
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

    }

    render() {
        if (this.state.graph.neighbours !== undefined && this.state.graph.neighbours[this.state.activeScene.name] !== undefined) {
            this.currentLevel = Object.keys(this.state.graph.scenes).filter(name =>
                this.state.graph.neighbours[this.state.activeScene.name].includes(name)
                || name === this.state.activeScene.name);
        }
        else
            this.currentLevel = [];
        return (
                <Scene stats>
                    <a-assets>
                        {this.generateAssets()}
                    </a-assets>
                    {this.generateBubbles()}
                    <Entity key="keycamera" id="camera" camera look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor" raycaster="objects: [data-raycastable];" pointsaver/>
                        </Entity>
                    </Entity>
                </Scene>
        )
    }

    generateAssets(){
        return this.currentLevel.map(sceneName => {
            let scene = this.state.graph.scenes[sceneName];
            let currAssets = [];
            //first, push the background media.
            currAssets.push(
                <video key={"key" + scene.name} crossorigin={"anonymous"} id={scene.img} loop={"true"}  preload="auto"
                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + this.state.runState[scene.name].background}
                />);
            //second, push the media of the interactive objs
            Object.values(scene.objects).flat().forEach(obj => {
                Object.keys(obj.media).map(k => {
                    if(obj.media[k] !== null){
                        currAssets.push(
                            <video id={k+"_" + obj.uuid} key={k+"_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                                   preload="auto" loop={false} crossorigin="anonymous"
                            />
                        )
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
            //third, push the media present in the actions
            //TODO do it! maybe not necessary
            scene.rules.forEach(()=>{});
            //return the assets
            return currAssets;
        }).flat();
    }

    generateCurrentAsset(obj){
        switch (obj.type) {
            case InteractiveObjectsTypes.TRANSITION:
                if(obj.media.media0 !== null){
                    return(
                    <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0}
                                   preload="auto" loop={false} crossorigin="anonymous"
                    />)
                }
                else return null;
            case InteractiveObjectsTypes.SWITCH:
                let i = (this.state.runState[obj.uuid].state === "OFF")?0:1;
                if(obj.media["media"+i] !== null)
                    return(
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i]}
                               preload="auto" loop={false} crossorigin="anonymous"
                        />)
                else if (obj.media["media"+((i+1)%2)] !== null)
                    return(
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)]}
                               preload="auto" loop={false} crossorigin="anonymous"
                        />)
                else return null;
            default:
                return null;
        }
    }

    generateBubbles(){
        return this.currentLevel.map(sceneName =>{
            let scene = this.state.graph.scenes[sceneName];
            return (
                <Bubble key={"key" + scene.name} scene={scene} isActive={scene.name === this.state.activeScene.name}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)} runState={this.state.runState}
                />
            );
        });
    }
}






















