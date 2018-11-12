//import Transition from "../../interactives/Transition";
//import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe_selectable'
//import {Curved, Sound} from './aframe-entities';
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import PlanarScene from './PlanarScene'
import SceneAPI from "../../utils/SceneAPI";
import ConditionUtils from "../../interactives/rules/ConditionUtils";
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import {transition} from "./aframe_objects";
const eventBus = require('./eventBus');

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
        let scene = this.props.scenes.toArray()[0];
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph);
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
                    console.log('click in object!'+rule.object_uuid)
                    rule.actions.forEach(action => me.executeAction(rule, action))
                }
            })
        })
    }

    executeAction(rule, action){
        switch (action.type) {
            case RuleActionTypes.TRANSITION:
                let duration = 2000;
                this.state.activeScene.objects.transitions.forEach(t =>{ //we should check the other objects as well
                    if(t.uuid === rule.object_uuid)
                        duration = t.duration;
                });
                transition(this.state.activeScene.name, action.target, duration);
                break;
            default:
                console.log('not yet implemented');
                console.log(action);
        }
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

                skies = currentLevel.map((sky) => {

                    let mats;
                    let active = true;
                    let curvedImages = [];

                    let scene = this.state.graph.scenes[sky];
                    if (sky === this.state.activeScene.img) {
                        curvedImages = scene.objects.transitions;
                        mats = "opacity: 1; visible: true";
                        active = false;
                    }
                    else mats = "opacity: 0; visible: false";
                    return (
                        <Bubble key={"key" + scene.name} name={scene.name} img={scene.img} material={mats}
                                transitions={curvedImages} activeScene={active}
                                handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}/>
                    );
                })
            }
        }
        return (
            <div id="mainscene">
                <Scene stats>
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
}






















