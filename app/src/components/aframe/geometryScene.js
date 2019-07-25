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

/**
 * Give the points from the pointsaver component and update the object vertices
 * @param props
 */
export function givePoints(props) {
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.components.pointsaver.points;
    let isCurved = cursor.components.pointsaver.attrValue.isCurved === 'true';
    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );
    //console.log(puntisalvati.join())
    if(isCurved ){
        interface_utils.setPropertyFromValue(props.interactiveObjects.get(props.currentObject), 'vertices', puntisalvati.join(), props)
    } else {
        interface_utils.updateAudioVertices(props.audios.get(props.editor.selectedAudioToEdit), puntisalvati.join(), props)
    }

}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        let scene;
        console.log(props.editor.selectedSceneSpatialAudio && this.props.editor.selectedAudioToEdit)
        if(props.editor.selectedSceneSpatialAudio && this.props.editor.selectedAudioToEdit)
            scene = props.editor.selectedSceneSpatialAudio;
        else
            scene = props.currentScene;

        console.log(scene)
        this.state = {
            scenes: props.scenes.get(scene)
        };
        //console.log(props.objectToScene.get(props.currentObject));
        //console.log(props.currentObject);
        //console.log(this.state.scenes)
        //console.log(props.editor.selectedAudioToEdit)
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
        // If thare are more the two points draw a line among them
        if (lengthLine >= 2) {
            let tmp = document.createElement('a-entity');
            tmp.setAttribute('scale', scale);
            tmp.setAttribute('line', 'start: ' + a_point[(lengthLine - 1)].toArray().join(" "));
            tmp.setAttribute('line', 'end: ' + a_point[(0)].toArray().join(" "));
            tmp.setAttribute('class', 'line');
            scene.appendChild(tmp);
        }

        //SetState in order to update the scene
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
                tmp.setAttribute('geometry', 'primitive: sphere; radius: 0.09');
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('position',  a_point[(length - 1)].toArray().join(" "));
                a_point[(length-1)].x *= moltiplier;
                tmp.setAttribute('id', idPoint);
                tmp.setAttribute('material', 'color: green; shader: flat');
                tmp.setAttribute('class', 'points');
                scene.appendChild(tmp);

                // se sono presenti più di due punti allora disegno le linee
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
        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            let scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');
            const keyName = event.key;
            if(keyName === 'c' || keyName === 'C') {
                document.getElementById("startedit").style.color = 'white'
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                let a_point = pointsaver.points;
                if(pointsaver != null && pointsaver.points.length !== 0) {
                    let cursor = document.querySelector('#cursor');
                    givePoints(this.props);
                    this.handleSceneChange();
                    cursor.setAttribute('color', 'black');
                    console.log(cursor)
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange(), true);
                    cursor.components.pointsaver.points = [];
                    console.log(cursor)
                    let points = scene.querySelectorAll(".points");
                    if(this.props.currentObject){
                        a_point = a_point.map(punto =>
                            punto.toArray().join(" ")
                        );
                        this.getObjectsFromUuid(this.props.currentObject, a_point.join());
                        points.forEach(point => {
                            scene.removeChild(point);
                        });
                    } else {
                        let lastChild = scene.querySelector('#point0');
                        lastChild.setAttribute('geometry', 'primitive: sphere; radius: 0.5');
                        lastChild.setAttribute('material', 'color: red; shader: flat');
                        lastChild.setAttribute('material', 'opacity: 0.5; shader: flat');
                    }

                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E') {
                document.getElementById("startedit").style.color = 'red';
                let lines = scene.querySelectorAll(".line");
                lines.forEach(line => {
                    scene.removeChild(line);
                });

                // Rimuovo i punti di eventuali geometrie o posizionamento di audio precedenti
                let removeSphere = scene.querySelectorAll(".points");
                removeSphere.forEach(point => {
                    scene.removeChild(point);
                });
                let cursor = document.querySelector('#cursor');
                cursor.setAttribute('color', 'green');
                console.log(this.props.editor.selectedAudioToEdit)
                if(cursor.components.pointsaver.attrValue.isCurved === 'true'){
                    if(document.getElementById("curve_"+this.props.currentObject))
                        document.getElementById("curve_"+this.props.currentObject).setAttribute('geometry', 'vertices: null')
                } else {
                    console.log(this.props.editor.selectedAudioToEdit)
                    if(document.getElementById("audio"+this.props.editor.selectedAudioToEdit)){
                        document.querySelector('a-scene').removeChild(document.getElementById("audio"+this.props.editor.selectedAudioToEdit));
                    }

                }
                cursor.components.pointsaver.points = [];
                cursor.addEventListener('click', this.handleFeedbackChange);
            }

            if(keyName === 'u' || keyName === 'U') {
                //TODO rimuovere le linee non solo i punti
                let pointsaver = document.querySelector('#cursor').components.pointsaver;
                if(pointsaver != null && pointsaver.points.length !== 0){
                    let points = pointsaver.points;
                    let lastID = points.length - 1;
                    //let scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');
                    let lastChild = scene.querySelector('#point' + lastID.toString());
                    points.splice(-1);
                    scene.removeChild(lastChild);
                }
            }

            if(keyName === 'q' || keyName === 'Q') {
                if(this.props.currentObject !== null)
                    InteractiveObjectAPI.saveObject(this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)),
                    this.props.interactiveObjects.get(this.props.currentObject));
                this.props.switchToEditMode();
            }

            if(keyName === 'h' || keyName === 'H') {
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
        let currentScene;
        if(this.props.editor.selectedSceneSpatialAudio)
            currentScene = this.props.editor.selectedSceneSpatialAudio;
        else
            currentScene = this.props.currentScene;
        this.createAudios(scene['scenes'][currentScene]);

        this.setState({completeScene: scene['scenes'][currentScene],
                       audio: audioToEdit
        })
    }

    render() {

        if (this.state.completeScene !== undefined ) {
            this.currentLevel = [this.state.scenes.uuid]
        }
        else{
            this.currentLevel = [];
        }

        let is3dScene = this.state.scenes.type===Values.THREE_DIM;
        let rayCastOrigin = is3dScene?'cursor':'mouse';
        let curvedImages = [];
        let isCurved = this.props.currentObject!==null;
        let currenteObjectUuid;
        console.log(this.props.editor.selectedAudioToEdit)
        if(this.props.currentObject){
            currenteObjectUuid = this.props.currentObject;
        } else {
            currenteObjectUuid = this.props.audios.get(this.props.editor.selectedAudioToEdit).uuid;
        }
        if(isCurved){
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
        //let audios = this.props.audios.get(this.props.editor.selectedAudioToEdit);
        //this.createAudios(skie);
        return(
            <div id="mainscene" tabIndex="0">
                <div id="UI" >
                    <div id="keyMap" >
                        <h1>Keys</h1>
                        <li class="keyElements">
                            <ul id="startedit">E: Inizia a disegnare</ul>
                            <ul>C: Conferma</ul>
                            <ul>U: Elimina ultimo punto</ul>
                            <ul>Q: Torna all'editor</ul>
                            <ul>H: Mostra/Nascondi</ul>
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
                            <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: " + rayCastOrigin}
                                    pointsaver={'isCurved:' + isCurved + '; uuid: ' + currenteObjectUuid}
                                    visible={is3dScene}/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }

    generateAssets(){
        return this.currentLevel.map(sceneName =>{
            return aframe_assets.generateAsset(this.state.completeScene,
                                               this.state.completeScene.img, [], [],  'geometry')
        })
    }

    generateBubbles(){
        let curvedToEdit = this.props.currentObject?this.props.currentObject:'';
        return this.currentLevel.map(sceneName =>{
            return (
                <Bubble key={"key" + sceneName} scene={this.state.completeScene} isActive={true}
                        handler={() => this.handleSceneChange()} editMode={true} curvedToEdit={curvedToEdit}
                        assetsDimention={this.props.assets.get(this.state.scenes.img)}

                />
            );
        });
    }

    createAudios(scene){
        // Inserisco gli oggetti audio nella scena
        let mainscene = document.querySelector('a-scene')
        scene.audios.forEach(a => {
            if(a.vertices !== undefined) {
                let audio = document.createElement('a-entity');
                audio.setAttribute('id', 'audio' + a.uuid);
                audio.setAttribute('position', a.vertices);
                audio.setAttribute('geometry', 'primitive: sphere; radius: 0.4');
                if(this.props.editor.selectedAudioToEdit === a.uuid)
                    audio.setAttribute('material', 'color: red; shader: flat');
                audio.setAttribute('material', 'opacity: 0.7; shader: flat');
                mainscene.appendChild(audio);
            }
        });
        this.setState({scenes: this.state.scenes})
    }

    getObjectsFromUuid(uuid, vertices){
        let currentScene = this.state.completeScene;

        for (let [key, value] of Object.entries(currentScene.objects)) {
            value.forEach(function(o, index) {
                if(o.uuid === uuid){
                    currentScene.objects[key][index].vertices=vertices;
                }
            })
        }
        this.setState({
            completeScene: currentScene
        })
    }

}


