import Transition from "../../interactives/Transition";
import MyScene from "../../scene/MyScene";
import 'aframe';
import './aframe-selectable'
import {Curved, Sound} from './aframe-entities';
import React from 'react';
import {Entity, Scene} from 'aframe-react';


function createTransation(tr, target, theta){

    tr.rules.target=target;
    tr.height = 7;
    tr.theta = theta;
    tr.radius = 9;
}

function sceneFactory() {
    let sceneList = [];

    let scene1 = new MyScene("bolla02.mp4");
    let tr1 = new Transition('', 2000, '0 156 0');
    createTransation(tr1, 'bolla06', 50);
    scene1.transitions.push(tr1);
    //scene1.tag.tagName='ingresso.mp3';
    sceneList.push(scene1);

    let scene2 = new MyScene("bolla06.mp4");
    let tr2 = new Transition('', 2000, '0 126 0');
    let tr12 = new Transition('', 2000, '0 306 0');
    createTransation(tr2, 'bolla10', 50);
    createTransation(tr12, 'bolla02', 50);
    scene2.transitions.push(tr2);
    scene2.transitions.push(tr12);
    //scene2.tag.tagName='ficus.mp3';
    sceneList.push(scene2);

    let scene3 = new MyScene("bolla10.mp4");
    let tr3 = new Transition('', 2000, '0 126 0');
    let tr13 = new Transition('', 2000, '0 306 0');
    createTransation(tr3, 'bolla15', 50);
    createTransation(tr13, 'bolla06', 50);
    scene3.transitions.push(tr3);
    scene3.transitions.push(tr13);
    sceneList.push(scene3);

    let scene4 = new MyScene("bolla15.mp4");
    let tr4 = new Transition('', 2000, '0 126 0');
    let tr7 = new Transition('', 2000, '0 36 0');
    let tr14 = new Transition('', 2000, '0 306 0');
    createTransation(tr4, 'bolla18', 50);
    createTransation(tr7, 'bolla19', 50);
    createTransation(tr14, 'bolla10', 50);
    scene4.transitions.push(tr4);
    scene4.transitions.push(tr7);
    scene4.transitions.push(tr14);
    sceneList.push(scene4);

    let scene5 = new MyScene("bolla19.mp4");
    let tr5 = new Transition('', 2000, '0 135 0');
    let tr11 = new Transition('', 2000, '0 233 0');
    createTransation(tr5, 'bolla22', 35);
    createTransation(tr11, 'bolla15', 35);
    scene5.transitions.push(tr5);
    scene5.transitions.push(tr11);
    sceneList.push(scene5);

    let scene6 = new MyScene("bolla18.mp4");
    let tr6 = new Transition('', 2000, '0 317 0');
    let tr9 = new Transition('', 2000, '0 85 0');
    createTransation(tr6, 'bolla15', 50);
    createTransation(tr9, 'bolla22', 35);
    scene6.transitions.push(tr6);
    scene6.transitions.push(tr9);
    sceneList.push(scene6);

    let scene7 = new MyScene("bolla22.mp4");
    let tr8 = new Transition('', 2000, '0 180 0');
    let tr10 = new Transition('', 2000, '0 25 0');
    createTransation(tr8, 'bolla19', 25);
    createTransation(tr10, 'bolla18', 35);
    scene7.transitions.push(tr8);
    scene7.transitions.push(tr10);
    sceneList.push(scene7);

    // var travel = new MyScene("travel.mp4")

    return sceneList;
}

class Bubble extends React.Component {
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear")
            {
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'opacity: 0.80');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');

                el.props.handler(el.props.name);
            }

            this.components[evt.detail.name].animation.reset();
        });
    }

    render() {
        const curves = this.props.transitions.map(curve => {
            return(
                <Curved key={"keyC"+ curve.rules.target} target={curve.rules.target}
                        rotation={curve.rotation} theta={curve.theta} height={curve.height}/>
            );
        });

        const sound = <Sound track={this.props.track} id = {this.props.name}/>;

        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} muted
                    src={"http://localhost:3000/media/2k/" + this.props.img} radius="10" material={this.props.material} >
                {curves} {sound}
            </Entity>
        );
    }
}

class PlanarScene extends React.Component{
    render() {

        return(
            <Entity primitive="a-video" id={this.props.name}
                    src={"http://localhost:3000/media/2k/" + "provaPlane.mp4"} position={"0 0 -43"} geometry={"height: 9; width: 16"}>
            </Entity>
        );
    }
}

export default class VRScene extends React.Component{

    constructor(props) {
        super(props);
        const fact = sceneFactory();
        this.state = {
            scenes: fact,
            activeScene: 0,
            planeScene: false,
            cameraType: "",
        };
    }

    handleSceneChange(newActiveScene) {
        const index = this.state.scenes.findIndex(el => {return el.name === newActiveScene});

        this.setState({
            activeScene: index
        })
    }

    render() {
        let skies = this.state.scenes.map((sky, index) =>
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
            if(!this.state.planeScene){
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




















