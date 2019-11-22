/**
 * Il componente GeometryScene ha la funzione di creare la scena per la creazine delle geomtrie dell'oggetto corrente
 * gestisce scene sia 3D che 2D, utilizza il componente Bubble per la creazione della bolla contenente l'oggetto
 * si qui vogliamo creare o modificare la geometria
 * Si occupa di evidenziare la geometria in modo che l'utente sia consapelo di quale oggetto stia modificando
 * Per gli occetti che prevedono una geometria verra' usata la geometria custom creata da noi
 * Per gli oggetti che prevedono il posizionamento di un punto, come oggetti audio e POINT_OF_INTEREST verra' posizionato un punto
 *
 */
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
import Values from "../../rules/Values";
import {calculate2DSceneImageBounds} from "./aframe_curved";

/**
 * Dati i punti presi da pointSaver viene aggiornato l'oggetto corrente
 * Le coordinate dei punti verranno salvate in formato relativo, quindi divise la la dimensione della canvas corrente
 * questo viene fatto solo per la scene 2D, per le scene 3D non serve
 * @param props
 */
//TODO provare ad calcolare le coordinate relative usato la dimensione dell'asset invece che della canvas
export function givePoints(props) {
    let cursor = document.querySelector('a-cursor');
    let puntisalvati = cursor.components.pointsaver.points;
    let isCurved = cursor.components.pointsaver.attrValue.isCurved === 'true';

    if(props.scenes.get(props.currentScene).type === '2D'){

        let Width = props.assets.get(props.scenes.get(props.currentScene).img).width / 100;
        let Height = props.assets.get(props.scenes.get(props.currentScene).img).height / 100;
        let bounds = calculate2DSceneImageBounds(Width, Height);
        let canvasWidth = bounds.w;
        let canvasHeight = bounds.h;

        //if(!props.editor.audioPositioning){
            puntisalvati = puntisalvati.map(punto =>{
                punto.x = punto.x / canvasWidth;
                punto.y = punto.y / canvasHeight;
                return punto;
            })
        //}
    }

    puntisalvati = puntisalvati.map(punto =>
        punto.toArray().join(" ")
    );

    //console.log(props.scenes.get(props.currentScene))
    //console.log(puntisalvati.join())

    //Chiamo le funzioni relative all'aggiornamento dell'oggetto, in base al tipo di oggetto, geometria o punto
    if(isCurved){
        interface_utils.setPropertyFromValue(props.interactiveObjects.get(props.currentObject), 'vertices', puntisalvati.join(), props)
    } else {
        interface_utils.updateAudioVertices(props.editor.audioToEdit, puntisalvati.join(), props)
    }

}

export default class GeometryScene extends React.Component{

    constructor(props)
    {
        super(props);
        let scene;
        //carico la scena corrente, o se è un audio la scena a cui appartiene
        if(props.editor.audioPositioning)
            scene = props.editor.audioToEdit.scene;
        else
            scene = props.currentScene;

        this.state = {
            scenes: props.scenes.get(scene)
        };
        //console.log(props.objectToScene.get(props.currentObject));
        //console.log(props.currentObject);
        //console.log(this.state.scenes)
        //console.log(props.editor.selectedAudioToEdit)
    }

    /**
     * Questa funzione si occupa di aggiornare la scena una volta che l'utente ha confermatom quindi premuto il tasto C
     * aggiorna sia la scena che le proprieta' dell'oggetto
     */
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
        if(this.props.editor.audioPositioning){
            sceneState = this.props.scenes.get(this.props.editor.audioToEdit.scene);
        } else {
            sceneState = this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject));
        }

        this.setState({
            scenes: sceneState,
        })
    }

    /**
     * Funzione che si occupa di aggiornare la scena dopo ogni inserimento dell'utente
     */
    handleFeedbackChange() {
        if(document.querySelector('a-cursor').components.pointsaver != null) {
            let point_saver = document.querySelector('#cursor').components.pointsaver;
            let a_point = point_saver.points;
            let isCurved = point_saver.attrValue.isCurved === 'true';
            let isPoint = point_saver.attrValue.isPoint === 'true';
            //Punti
            let length = a_point.length;
            let idPoint = "point" + (length - 1).toString();
            let tmp = document.createElement('a-entity');
            let scene, scale, moltiplier; //Moltiplicatore mi serve per le scene 2D, la coordinata della x e' invertita

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

            //Se e' una geometria e non un punto posso aggiungere punti e collegarli con della linee
            if(isCurved && !isPoint){
                console.log(a_point)
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
                //Se sto editando un oggetto che prevede solo un punto, elimino dalla scena il punto precedentemente inserito
                let lastChild = scene.querySelector('#point0');
                if(lastChild) {
                    scene.removeChild(lastChild);
                }

                //Aggiungo il nuovo punto inserito dall'utente
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

        //Creo la scena corrente
        this.createScene();
        let is3dScene = this.state.scenes.type===Values.THREE_DIM;
        document.querySelector('#mainscene').addEventListener('keydown', (event) => {
            let scene = is3dScene? document.getElementById(this.state.scenes.name) : document.querySelector('a-scene');

            //Catturo il comando inserito dell'utente
            const keyName = event.key;

            //Tasto C confermo l'inserimento dei punti
            if(keyName === 'c' || keyName === 'C') {
                document.getElementById("startedit").style.color = 'white'
                let pointsaver = document.querySelector('#cursor').components.pointsaver; //Componente point saver all'interno del cursor
                let a_point = pointsaver.points;
                let isPoint = pointsaver.attrValue.isPoint === 'true';
                if(pointsaver != null && pointsaver.points.length !== 0) {
                    let cursor = document.querySelector('#cursor');

                    givePoints(this.props); //Aggiorno i punti dell'oggetto
                    this.handleSceneChange(); //Aggiorno la scena
                    //Aggiorno le proprieta' del cursor
                    cursor.setAttribute('color', 'black');
                    cursor.removeEventListener('click', function pointSaver(evt) {});
                    cursor.removeEventListener('click', this.handleFeedbackChange(), true);
                    cursor.components.pointsaver.points = []; //Svuoto i punti dentro point saver
                    let points = scene.querySelectorAll(".points");

                    //Se e' una geometria e non un punto rimuovo tutti gli indicatori dei punti presenti nella scena
                    if(!this.props.editor.audioPositioning && !isPoint){
                        a_point = a_point.map(punto =>
                            punto.toArray().join(" ")
                        );
                        this.getObjectsFromUuid(this.props.currentObject, a_point.join());
                        points.forEach(point => {
                            scene.removeChild(point);
                        });
                    } else {
                        //Se e' solo un punto lo cerco e lo elimino
                        let lastChild = scene.querySelector('#point0');
                        lastChild.setAttribute('geometry', 'primitive: sphere; radius: 0.5');
                        lastChild.setAttribute('material', 'color: red; shader: flat');
                        lastChild.setAttribute('material', 'opacity: 0.5; shader: flat');
                    }

                    //Aggiorno di nuovo la scena
                    this.handleSceneChange();
                }
            }

            if(keyName === 'e' || keyName === 'E') {
                document.getElementById("startedit").style.color = 'red';
                let lines = scene.querySelectorAll(".line");
                let point_saver = document.querySelector('#cursor').components.pointsaver;
                let isPoint = point_saver.attrValue.isPoint === 'true';
                lines.forEach(line => {
                    scene.removeChild(line);
                });

                // Rimuovo i punti di eventuali geometrie o posizionamento di audio precedenti
                let removeSphere = scene.querySelectorAll(".points");
                removeSphere.forEach(point => {
                    scene.removeChild(point);
                });

                //Preparo il cursor per l'inizio della creazione della geometria
                let cursor = document.querySelector('#cursor');
                cursor.setAttribute('color', 'green');

                //Rimuovo gli elementi dalla scena, la rimozione avviene in modo diverso a seconda del tipo di oggetto
                //la rimozione avviene se l'utente vuole inserire di nuovo i punti dopo aver confermato, devo rimuovore
                //quelli inseriti in precedenza
                if(cursor.components.pointsaver.attrValue.isCurved === 'true'){
                    if(document.getElementById("curve_"+this.props.currentObject) && !isPoint) //Geoemtria classica
                        document.getElementById("curve_"+this.props.currentObject).setAttribute('geometry', 'vertices: null')
                    else
                        document.getElementById(this.state.scenes.name).removeChild(document.getElementById("curve_"+this.props.currentObject))
                } else {
                    if(document.getElementById("audio"+this.props.editor.audioToEdit.uuid)) //Punto legato ad un audio
                        document.querySelector('a-scene').removeChild(document.getElementById("audio"+this.props.editor.audioToEdit.uuid));
                }
                cursor.components.pointsaver.points = [];
                cursor.addEventListener('click', this.handleFeedbackChange);
            }

            //Tasto U rimuovo l'ultimo punto inserito se ho sbagliato
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

            //Salvo le modifiche dell'oggetto e torno all'editor
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

    /**
     * Funzione molto simile a quella dentro VRScene, si occupa di generare la scena corrente, caricando la bolla giusta a seconda
     * del tipo di editing, se la creazione conivolge un oggetto audio carica la scena di appartenenza
     * @returns {Promise<void>}
     */
    async createScene(){
        let scene = {};
        await SceneAPI.getAllDetailedScenes(scene);

        let audioToEdit = this.props.editor.audioPositioning ? this.props.editor.audioToEdit : null;
        let currentScene;
        if(this.props.editor.audioPositioning)
            currentScene = this.props.editor.audioToEdit.scene;
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
        let rayCastOrigin = is3dScene?'cursor':'mouse'; //Devo capire che tipo di cursor devo creare, se per una scena 3D o 2D
        let curvedImages = [];
        let isCurved = !this.props.editor.audioPositioning;
        let isPoint = false;
        let currenteObjectUuid;

        //Se devo creare una geometria classica prendo l'oggetto indicato da currentObject altrimento da audioPositioning
        if(isCurved){
            currenteObjectUuid = this.props.currentObject;
        } else {
            currenteObjectUuid = this.props.editor.audioToEdit.uuid;
        }

        if(isCurved){
            let objects = this.props.scenes.get(this.props.objectToScene.get(this.props.currentObject)).get('objects');
            if(this.props.interactiveObjects.get(this.props.currentObject).type === 'POINT_OF_INTEREST')
                isPoint = true;

            //TODO verificiare shader delle curved, problema non trasparenza, questa cosa mi sa che non serve, verificare
            for(let key in objects){
                if(objects.hasOwnProperty(key)){
                    objects[key].forEach((uuid) => {
                        curvedImages.push(this.props.interactiveObjects.get(uuid).get('vertices'));
                    })
                }
            }
        }

        //Genero gli assets e la bolla
        let assets = this.generateAssets();
        let skie = this.generateBubbles();
        //let audios = this.props.audios.get(this.props.editor.selectedAudioToEdit);
        //this.createAudios(skie);
        return(
            <div id="mainscene" tabIndex="0">
                <div id="UI" >
                    <div id="keyMap" >
                        <h1>Keys</h1>
                        <ul class="keyElements">
                            <li id="startedit">E: Inizia a disegnare</li>
                            <li> C: Conferma </li>
                            <li> U: Elimina ultimo punto </li>
                            <li> Q: Torna all'editor </li>
                            <li> H: Mostra/Nascondi </li>
                        </ul>

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
                                    pointsaver={'isCurved:' + isCurved + '; ' + 'isPoint: ' + isPoint + '; uuid: ' + currenteObjectUuid}
                                    visible={is3dScene}/>
                        </Entity>
                    </Entity>
                </Scene>
            </div>
        );
    }

    /**
     * Funzione che richiama la funzione che si occupa di generare gli assets per la scena corrente
     * @returns {Array[]}
     */
    generateAssets(){
        return this.currentLevel.map(sceneName =>{
            return aframe_assets.generateAsset(this.state.completeScene,
                                               this.state.completeScene.img, [], [],  'geometry')
        })
    }

    /**
     * Funzione che si occupa di generare la bolla corrente, utilizza il componente Bubble
     * @returns {*[]}
     */
    generateBubbles(){
        let curvedToEdit = this.props.editor.audioPositioning?'':this.props.currentObject;
        return this.currentLevel.map(sceneName =>{
            return (
                <Bubble key={"key" + sceneName} scene={this.state.completeScene} isActive={true}
                        handler={() => this.handleSceneChange()} editMode={true} curvedToEdit={curvedToEdit}
                        assetsDimention={this.props.assets.get(this.state.scenes.img)}

                />
            );
        });
    }

    /**
     * Funzione che si occupa di inserire i segnaposto per ogni audio presente nella scena, prendo la posizione
     * di ogni audio li aggiungo
     * @param scene scena corrente
     */
    createAudios(scene){
        // Inserisco gli oggetti audio nella scena
        let mainscene = document.querySelector('a-scene')
        this.props.audios.forEach(a => {
            if(this.props.editor.audioToEdit && this.props.editor.audioToEdit.scene === a.scene){
                let audio = document.createElement('a-entity');

                //TODO forse si puo' semplificare alcuni campi sono uguali
                //Inserisco i punti, se e' quello che devo modificare lo colore di rosso
                if(this.props.editor.audioToEdit.uuid !== a.uuid) {
                    audio.setAttribute('id', 'audio' + a.uuid);
                    audio.setAttribute('geometry', 'primitive: sphere; radius: 0.4');
                    audio.setAttribute('position', a.vertices);
                    audio.setAttribute('material', 'opacity: 0.7; shader: flat');
                } else {
                    audio.setAttribute('id', 'audio' + this.props.editor.audioToEdit.uuid);
                    audio.setAttribute('geometry', 'primitive: sphere; radius: 0.4');
                    audio.setAttribute('position', this.props.editor.audioToEdit.vertices);
                    audio.setAttribute('material', 'opacity: 0.7; shader: flat');
                    audio.setAttribute('material', 'color: red; shader: flat');
                }
                mainscene.appendChild(audio);
            }
        });


        this.setState({scenes: this.state.scenes})
    }

    /**
     * Funzione che si occupa di cercare l'oggetto corrente all'interno di tutti gli oggetti
     * @param uuid
     * @param vertices
     */
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


