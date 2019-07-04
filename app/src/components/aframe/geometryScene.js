import 'aframe';
import './aframe_selectable'
import './aframe_newGeometry'
import './pac-look-controls'
import InteractiveObjectAPI from '../../utils/InteractiveObjectAPI'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import interface_utils from "../interface/interface_utils";
import Bubble from './Bubble';
import aframe_assets from "./aframe_assets";
import SceneAPI from "../../utils/SceneAPI";
import Values from "../../interactives/rules/Values";

export function givePoints(props)
{
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.components.pointsaver.points;

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );
    //console.log(puntisalvati.join())
    console.log(props)
    if(cursor.components.pointsaver.isCurved)
        interface_utils.setPropertyFromValue(props.interactiveObjects.get(props.currentObject), 'vertices', puntisalvati.join(), props)
    else
        interface_utils.updateAudioVertices(props.audios.get(props.editor.selectedAudioToEdit), puntisalvati.join(), props)
}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            scenes: props.scenes.get(props.currentScene)
        };
        console.log(props.objectToScene.get(props.currentObject));
        console.log(props.currentObject);
        console.log(this.state.scenes)
        console.log(props.editor.selectedAudioToEdit)
    }

    handleSceneChange()
    {
        let a_point = document.querySelector('#cursor').components.pointsaver.points;
        let lengthLine = a_point.length;
        let scene;
        //TODO migliore questo controllo, ci sono casi in cui non funziona, capire come passare un parametro, cosi non serve il controllo

        let scale;
        if(document.querySelector('a-sky')){
            scene = document.querySelector('a-sky');
            scale = "-1 1 1";
        } else {
            if(document.querySelector('a-videosphere')) {
                scene = document.querySelector('a-videosphere');
                scale = "-1 1 1";
            } else {
                scene = document.querySelector('a-scene');
                scale = "1 1 1";
            }
        }
        if (lengthLine >= 2) {
            let tmp = document.createElement('a-entity');
            tmp.setAttribute('scale', scale);
            tmp.setAttribute('line', 'start: ' + a_point[(lengthLine - 1)].toArray().join(" "));
            tmp.setAttribute('line', 'end: ' + a_point[(0)].toArray().join(" "));
            tmp.setAttribute('class', 'line');
            scene.appendChild(tmp);
        }

        //SetState per aggiornare lo stato
        let sceneState;
        if(this.props.currentObject){
            sceneState = this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject));
        } else {
            sceneState = this.props.scenes.get(this.state.audio.scene);
        }
        this.setState({
            scenes: sceneState,
        })
    }

    handleFeedbackChange() {
        if(document.querySelector('a-cursor').components.pointsaver != null) {
            let point_saver = document.querySelector('#cursor').components.pointsaver;
            let a_point = point_saver.points;
            let isCurved = point_saver.attrValue.isCurved === 'true';
            console.log(point_saver)
            //Punti
            let length = a_point.length;
            let idPoint = "point" + (length - 1).toString();
            let tmp = document.createElement('a-entity');
            let scene, scale, moltiplier;
            if(document.querySelector('a-sky')){
                scene = document.querySelector('a-sky');
                scale = "-1 1 1";
                moltiplier = -1;
            } else {
                if(document.querySelector('a-videosphere')) {
                    scene = document.querySelector('a-videosphere');
                    scale = "-1 1 1";
                    moltiplier = -1;
                } else {
                    scene = document.querySelector('a-scene');
                    scale = "1 1 1";
                    moltiplier = 1;
                }
            }
            if(isCurved){
                console.log('dio merda')
                tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('id', idPoint);
                tmp.setAttribute('material', 'color: green; shader: flat');
                tmp.setAttribute('class', 'points');
                scene.appendChild(tmp);

                let lengthLine = a_point.length;
                if (lengthLine >= 2) {
                    let tmp = document.createElement('a-entity');
                    tmp.setAttribute('scale', scale);
                    tmp.setAttribute('line', 'start: ' + a_point[(lengthLine - 2)].toArray().join(" "));
                    tmp.setAttribute('line', 'end: ' + a_point[(lengthLine - 1)].toArray().join(" "));
                    tmp.setAttribute('class', 'line');
                    scene.appendChild(tmp);
                }
            } else {
                let lastChild = scene.querySelector('#point0');
                if(lastChild) {
                    console.log(lastChild)
                    scene.removeChild(lastChild);
                }

                tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('id', idPoint);
                tmp.setAttribute('material', 'color: green; shader: flat');
                tmp.setAttribute('class', 'points');
                scene.appendChild(tmp);
            }


        }
    }

    componentDidMount() {
        this.createScene();

        let is3dScene = this.state.scenes.type===Values.THREE_DIM;
        let scene;
        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            const keyName = event.key;
            if(keyName === 'c' || keyName === 'C')
            {
                document.getElementById("startedit").style.color = 'white'
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                if(pointsaver != null && pointsaver.points.length !== 0) {
                    let cursor = document.querySelector('#cursor');
                    givePoints(this.props);
                    this.handleSceneChange();
                    cursor.setAttribute('color', 'black');
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange());
                    cursor.components.pointsaver.points = [];
                    let scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');
                    let points = scene.querySelectorAll(".points");

                    points.forEach(point => {
                        scene.removeChild(point);
                    });
                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E')
            {
                document.getElementById("startedit").style.color = 'red';
                scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');
                let lines = scene.querySelectorAll(".line");
                lines.forEach(line => {
                    scene.removeChild(line);
                });
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
                //TODO rimuovere le linee non solo i punti
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                if(pointsaver != null && pointsaver.points.length !== 0){
                    let points = pointsaver.points;
                    let lastID = points.length - 1;
                    let scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');
                    let lastChild = scene.querySelector('#point' + lastID.toString());
                    points.splice(-1);
                    scene.removeChild(lastChild);
                }
            }

            if(keyName === 'q' || keyName === 'Q')
            {
                if(this.props.currentObject !== null)
                    InteractiveObjectAPI.saveObject(this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)),
                    this.props.interactiveObjects.get(this.props.currentObject));
                this.props.switchToEditMode();
            }

            if(keyName === 'h' || keyName === 'H')
            {
                if(document.getElementById("keyMap").style.display !== 'none')
                    document.getElementById("keyMap").style.display = 'none';
                else
                    document.getElementById("keyMap").style.display = 'block';
            }
        });
    }

    async createScene(){
        let scene = {};
        await SceneAPI.getAllDetailedScenes(scene);
        let audioToEdit = this.props.editor.selectedAudioToEdit ? this.props.audios.get(this.props.editor.selectedAudioToEdit) : null;
        this.setState({completeScene: scene,
                       audio: audioToEdit
        })
    }

    render()
    {

        if (this.state.completeScene !== undefined ) {
            this.currentLevel = [this.state.scenes.uuid]
        }
        else{
            this.currentLevel = [];
        }

        let is3dScene = this.state.scenes.type===Values.THREE_DIM;
        let rayCastOrigin = is3dScene?'cursor':'mouse';
        let curvedImages = [];
        let currenteObjectUuid;

        /*if(this.props.currentObject){
            currenteObjectUuid = this.props.objectToScene.get(this.props.currentObject);
        } else {
            currenteObjectUuid = this.props.audios.get(this.props.editor.selectedAudioToEdit).scene;
        }*/

        if(this.props.currentObject !== null){
            let objects = this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)).get('objects');
            //let objects = this.props.scenes.get(currenteObjectUuid).get('objects');

            //TODO verificiare shader delle curved, problema non trasparenza
            for(let key in objects){
                if(objects.hasOwnProperty(key)){
                    objects[key].forEach((uuid) => {
                        curvedImages.push(this.props.interactiveObjects.get(uuid).get('vertices'));
                    })
                }
            }
        }

        let assets = this.generateAssets();
        let skie = this.generateBubbles();
        let objectType = this.props.editor.selectedAudioToEdit===null;
        console.log(this.props.editor.selectedAudioToEdit)
        return(
            <div id="mainscene" tabIndex="0">
                <div id="UI" >
                    <div id="keyMap" >
                        <h1>Keys</h1>
                        <li class="keyElements">
                            <ul id="startedit">E: Start Edit</ul>
                            <ul>C: Create Geometry</ul>
                            <ul>U: Undo</ul>
                            <ul>Q: Go Back</ul>
                            <ul>H: Hide/Show</ul>
                        </li>

                    </div>
                </div>
                <Scene background="color: black">
                    <a-assets>
                        {assets}
                    </a-assets>
                    {skie}
                    <Entity primitive="a-camera" key="keycamera" id="camera"
                            pac-look-controls={"pointerLockEnabled: " + is3dScene + ";planarScene:" + !is3dScene +";"}
                            look-controls="false" wasd-controls="false">
                        <Entity mouse-cursor>
                            <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: " + rayCastOrigin} pointsaver={'isCurved:' + objectType}  visible={is3dScene}/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }

    generateAssets(){
        return this.currentLevel.map(sceneName =>{
            return aframe_assets.generateAsset(this.state.completeScene.scenes[sceneName],
                                               this.state.completeScene.scenes[sceneName].img, [], [],  'geometry')
        })
    }

    generateBubbles(){
        return this.currentLevel.map(sceneName =>{
            return (
                <Bubble key={"key" + sceneName} scene={this.state.completeScene.scenes[this.state.scenes.uuid]} isActive={true}
                        handler={() => this.handleSceneChange()} editMode={true}
                />
            );
        });
    }

}


