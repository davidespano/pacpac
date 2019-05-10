import 'aframe';
import './aframe_selectable'
import './aframe_newGeometry'
import InteractiveObjectAPI from '../../utils/InteractiveObjectAPI'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import interface_utils from "../interface/interface_utils";
import Bubble from './Bubble';
import aframe_utils from "./aframe_utils";
import SceneAPI from "../../utils/SceneAPI";

/*function Curved(props)
{
    return(
        <Entity geometry={"primitive: polyline; vertices: " + props.vertices} scale= "-1 1 1" material="side: double; opacity: 0.50"/>
    );
}

class Bubble extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {

        const curves = this.props.curves.map(vertices =>
        {
            return(
                <Curved vertices={vertices}/>
            );
        });

        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-sky" id={this.props.name} src={'#' + this.props.name} radius="9.5">
                {curves}
            </Entity>
        );
    }
}*/

export function givePoints(props)
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.components.pointsaver.points;

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );
    //console.log(puntisalvati.join())
    interface_utils.setPropertyFromValue(props.interactiveObjects.get(props.currentObject), 'vertices', puntisalvati.join(), props)
}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            scenes: props.scenes.get(props.objectToScene.get(props.currentObject)),

        };
        console.log(props.objectToScene.get(props.currentObject));
        console.log(props.currentObject);

    }

    handleSceneChange()
    {
        this.setState({
            scenes: this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject))
        })
    }

    handleFeedbackChange() {
        if(document.querySelector('a-cursor').components.pointsaver != null) {
            let a_point = document.querySelector('#cursor').components.pointsaver.points;

            //Punti
            let length = a_point.length;
            let idPoint = "point" + (length - 1).toString();
            let tmp = document.createElement('a-entity');
            tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
            a_point[(length-1)].x *= -1;
            tmp.setAttribute('id', idPoint);
            tmp.setAttribute('material', 'color: green; shader: flat');
            tmp.setAttribute('class', 'points');
            document.querySelector('a-sky').appendChild(tmp);


            //Linee, purtroppo è poco intuitivo. Provandolo sembra bellino

            let lengthLine = a_point.length;
            if (lengthLine >= 2) {
                let tmp = document.createElement('a-entity');
                tmp.setAttribute('scale', '-1 1 1');
                tmp.setAttribute('line', 'start: ' + a_point[(lengthLine - 2)].toArray().join(" "));
                tmp.setAttribute('line', 'end: ' + a_point[(lengthLine - 1)].toArray().join(" "));
                document.querySelector('a-sky').appendChild(tmp);
            }

        }
    }

    componentWillMount(){
        this.createScene();
    }
    componentDidMount() {

        console.log('ciao')

        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            const keyName = event.key;
            if(keyName === 'c' || keyName === 'C')
            {
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                if(pointsaver != null && pointsaver.points.length != 0) {
                    let cursor = document.querySelector('#cursor');
                    givePoints(this.props);
                    this.handleSceneChange();
                    cursor.setAttribute('color', 'black');
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange);
                    cursor.components.pointsaver.points = [];
                    let scene = document.querySelector("a-sky");
                    let removeSphere = scene.querySelectorAll(".points");
                    removeSphere.forEach(point => {
                        scene.removeChild(point);
                    });
                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E')
            {
                let scene = document.querySelector("a-sky");
                let removeSphere = scene.querySelectorAll(".points");
                removeSphere.forEach(point => {
                    scene.removeChild(point);
                });

                let cursor = document.querySelector('#cursor');
                cursor.setAttribute('color', 'green');
                cursor.components.pointsaver.points = [];
                cursor.addEventListener('click', this.handleFeedbackChange);
            }

            if(keyName === 'u' || keyName === 'U')
            {
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                if(pointsaver != null && pointsaver.points.length != 0){
                    let points = pointsaver.points;
                    let lastID = points.length - 1;
                    let scene = document.querySelector('a-sky');
                    let lastChild = scene.querySelector('#point' + lastID.toString());
                    points.splice(-1);
                    scene.removeChild(lastChild);
                }
            }

            if(keyName === 'q' || keyName === 'Q')
            {
                InteractiveObjectAPI.saveObject(this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)),
                    this.props.interactiveObjects.get(this.props.currentObject));
                this.props.switchToEditMode();
            }
        });
    }

    async createScene(){
        let scenaaa = {};
        await SceneAPI.getAllDetailedScenes(scenaaa);
        console.log(scenaaa)
        this.setState({completeScene: scenaaa})

    }

    render()
    {

        if (this.state.completeScene !== undefined ) {
            console.log(this.state.scenes)
            this.currentLevel = [this.state.scenes.name]
        }
        else{
            this.currentLevel = [];
        }


        let sky = this.state.scenes;
        let curvedImages = [];
        let objects = this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)).get('objects');
        for(let key in objects){
            if(objects.hasOwnProperty(key)){
                objects[key].forEach((uuid) => {
                    curvedImages.push(this.props.interactiveObjects.get(uuid).get('vertices'));
                })
            }
        }
        let assets = this.generateAssets2();
        console.log(assets)
        let skies = this.generateBubbles();



        /*if(stores_utils.getFileType(sky.img) === 'video'){
            backGround = (
                <video key={"key" + sky.name} crossorigin={"anonymous"} id={sky.img} loop={"true"}  preload="auto"
                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + sky.img}
                       playsInline={true} autoPlay muted={true}
                />)
        } else {
            backGround = (<img id={sky.img} key={"key" + sky.name} crossorigin="Anonymous"
                                    src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + sky.img}
            />)
        }*/

        return(
            <div id="mainscene" tabIndex="0">
                <div id="UI">
                    <div id="keyMap">
                        <h1>Keys</h1>
                        <li class="keyElements">
                            <ul>E: Start Edit</ul>
                            <ul>C: Create Geometry</ul>
                            <ul>U: Undo</ul>
                            <ul>Q: Go Back</ul>
                        </li>

                    </div>
                </div>
                <Scene>
                    <a-assets>
                        {assets}
                    </a-assets>
                    {skies}


                    <Entity primitive="a-camera" key="keycamera" id="camera" look-controls_us="pointerLockEnabled: true">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" pointsaver id="cursor" />
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }

    generateAssets2(){
        return this.currentLevel.map(sceneName =>{
            console.log(this.state.completeScene)
            return aframe_utils.generateAsset(this.state.completeScene.scenes[sceneName], this.state.completeScene.scenes[sceneName].img)
        })
    }

    generateBubbles(){
        return this.currentLevel.map(sceneName =>{
            return (
                <Bubble key={"key" + sceneName} scene={this.state.completeScene.scenes[this.state.scenes.name]} isActive={true}
                        handler={(newActiveScene) => this.handleSceneChange(newActiveScene)}
                />
            );
        });
    }
}
//Aggiungere due text, button, qualcosa che indichi all'utente come utilizzare salvataggio e edit.
//Meglio non usare le linee, usa semplicemente i punti che indicano come fare

