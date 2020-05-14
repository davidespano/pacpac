import 'aframe';
import './aframe_selectable'
import './pac-look-controls'
//import './aframeUtils'
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import Bubble from './Bubble';
import SceneAPI from "../../utils/SceneAPI";
import Asset from "./aframe_assets";
import evalCondition from "../../rules/ConditionUtils";
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
import Timer from "../../interactives/Timer";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import {calculate2DSceneImageBounds} from "./aframe_curved";
const soundsHub = require('./soundsHub');
const resonance = require('./Audio/Resonance');
const THREE = require('three');
const eventBus = require('./eventBus');
const {mediaURL} = settings;
let sceneLoaded = false;
let gameTimeSize;
let healthSize;
let scoreSize;
let timerSize;
let timerID;
window.healthValue = undefined;
//variabili del timer pubbliche perchè accedute da render e tick
// [davide] teniamo dentro this.props.debug traccia del fatto che la scena sia creata
// da motore di gioco o per debug
// Ho l'impressione che l'attributo this.props.currentScene che viene dalla vecchia
// scena di debug e l'attributo this.props.activeScene possano essere unificati in un
// unico attributo. Non lo faccio per paura di fare danni, dopo la scuola estiva va fatto.
// Per il momento faccio dei test al momento della generazione dei componenti e popolo i
// parametri in base al flag di debug.

export default class VRScene extends React.Component {
    //TODO: rimuovere currentscene o activescene
    constructor(props) {
        super(props);
        let scene = null;
        //Se arrivo dal debug prendo la scena corrente, altrimenti prendo la prima scena dalla lista delle scene
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
            camera: new THREE.Vector3(),
            stats: false,
        };

        if(!this.props.debug && this.props.editor.gameId === null){
            document.querySelector('link[href*="bootstrap"]').remove();
        }
    }

    componentDidMount() {

        //Torno all'interfaccia premendo il tasto q, non funzionava bene, una volta tornati all'editor il css non veniva caricato, verificare perche'
        /*document.querySelector('#mainscene2').addEventListener('keydown', (event) => {
            const keyName = event.key;
            //Torno all'editor
            if(keyName === 'q' || keyName === 'Q') {
                //this.props.switchToEditMode();
            }
            //Attivo/Disattivo statistiche
            if(keyName === 's' || keyName === 'S') {
                let stats = !this.state.stats
                this.setState({
                    stats: stats,
                });
            }
        });*/
        this.state.camera = new THREE.Vector3();
        //Lancio la funzione per caricare tutti i dati del gioco

        this.loadEverything();

        this.interval = setInterval(() => this.tick(), 100);
    }

    componentDidUpdate(prevProps){
    }
    /**
     * Funzione che aggiorna la rotazione della camera, utile per gli audio spaziali
     */
    tick() {
        //Aggiorno la rotazione della camera ogni n millisecondi
        let camera = document.querySelector('#camera');
        if(camera){
            camera.object3D.getWorldDirection(this.state.camera);
            this.updateAngles();
        }
        let skysphere = document.getElementById(this.state.activeScene.img);
        if (skysphere != null) //se la skysphere ha caricato ed è stata trovata
        {
            this.loadingManager()
            this.timerManager()
            this.gameTimeManager()
        }
    }

    loadingManager()
    {
        let sphere = document.getElementById(this.state.activeScene.name)
        let loadingsphere = document.getElementById(this.state.activeScene.name + 'loading');
        if (!sceneLoaded && stores_utils.getFileType(this.state.activeScene.img) === 'video') //sceneLoaded è impostato a false nella handleSceneChange
        {
            sphere.components["material"].data.src.play();//avvio il video della scena in cui sono entrato
            if (loadingsphere !=null && sphere.components["material"].data.src.currentTime > 0)
            {
                console.log("sceneLoaded = ", sceneLoaded)
                loadingsphere.setAttribute('visible', 'false');
            }
            if (sphere.components["material"].data.src.currentTime > 1)
            {
                //se la transizione è più lunga di un secondo potrebbe non funzionare
                sceneLoaded = true;
            }
        }
        else if (sceneLoaded) // se la scena viene aggiornata perchè si utilizza un oggetto in scena, questo fa sparire la loading screen
        {
            loadingsphere.setAttribute('visible', 'false');
        }
    }

    //TODO: alzare l'evento al termine del timer
    timerManager()
    {
        let timer = document.getElementById(this.state.activeScene.name + 'timer')
        if (timer != null && window.timerTime > 0 && window.timerIsRunning) //se è presente un timer nella scena
        {
            window.timerTime = window.timerTime - 0.1;
            window.timerTime = window.timerTime.toFixed(1);
            let textProperties = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + timerSize +
                "; value:" + window.timerTime;
            timer.setAttribute('text', textProperties)
            if (window.timerTime == 0)
            { //nel caso il timer venga azzerato da regola devo aggiornarlo qui manualmente
                let textProperties = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + timerSize +
                    "; value:" + 0;
                timer.setAttribute('text', textProperties)
                //eventBus.emit()
            }
        }
    }

    gameTimeManager()
    {
        let gameTime = document.getElementById(this.state.activeScene.name + 'gameTime')
        if (gameTime != null) //se è presente il game timer nella scena
        {
            if (window.gameTimeValue == undefined)
            {
                window.gameTimeValue = 0;
            }
            window.gameTimeValue = window.gameTimeValue - (-0.1); //non toccare, col + concatena stringhe a caso
            window.gameTimeValue = window.gameTimeValue.toFixed(1);
            let textProperties = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + gameTimeSize +
                "; value:" + window.gameTimeValue;
            gameTime.setAttribute('text', textProperties)
        }
    }

    /**
     * Funzione asincrona che richiede al database tutte le informazioni del gioco, compresi audio,
     * tutte le scene e gli oggetti, regole in esse contenute
     * @returns {Promise<void>}
     */
    async loadEverything() {
        //[Vittoria] la setState aggiorna tutto lo stato del gioco, react li fa solo quando c'è un cambiamento di stato
        this.setState({
            scenes: this.props.scenes.toArray(),
        });

        //Faccio due richieste, una per avere tutti gli audio del gioco, e il grafo
        let audios = [];
        await AudioAPI.getAudios(audios, this.props.editor.gameId);
        let gameGraph = {};
        await SceneAPI.getAllDetailedScenes(gameGraph, this.props.editor.gameId);

        //Creo lo stato iniziale del gioco dal grafo
        let runState = this.createGameState(gameGraph);

        let scene = null;
        if(!this.props.debug){
            // scene init for playing the game
            //[Vittoria] cerco la scena
            scene = gameGraph['scenes'][this.state.activeScene.uuid];
            //[Vittoria]se per caso ho una scena di Home prendo quella
            let home = await SceneAPI.getHome(this.props.editor.gameId);
            if(home !== ''){
                //[Vittoria]se non ho una scena di Home uso la scena presa su
                scene = this.props.scenes.get(home);
            }
        }else{
            // scene init for debug purposes
            scene = gameGraph['scenes'][this.props.currentScene]; //[Vittoria]prendo la scena su cui ho cliccato
            //EditorState.debugRunState = runState;
            this.props.updateDebugRunState('runState', {...runState});
        }

        this.setState({
            graph: gameGraph,
            activeScene: scene,
            runState: runState,
            audios: audios,
        });
        //Lancio la funzione per generare tutti i listeners
        this.createRuleListeners();
        document.querySelector('#camera').removeAttribute('look-controls');
        document.querySelector('#camera').removeAttribute('wasd-controls');
    }

    /**
     * Funzione che crea tutti i listeners legati agli eventi delle regole
     */
    createRuleListeners(){
        let me = this;

        //[Vittoria] ogni volta che c'è una scena fa tutte le regole del gioco
        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {

            let duration = 0;
            let objectVideo;

            rule.actions.sort(stores_utils.actionComparator);

            //Funzione che si occupa di eseguire le azioni
            let actionCallback = function(action){
                // chiudo i parametri in modo che possa essere utilizzata come callback dal debug
                // senza passarli esplicitamente
                let closure = function() {
                    setTimeout(function () {
                        executeAction(me, rule, action)
                    }, duration);
                    //Se e' coinvolto un cambio sfondo devo aspettare, in caso sia un video, che finisca, prima di avviare la prossima azione
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
                // [Vittoria] qua sto aggiungendo un evento click con il suo uuid dell'oggetto,
                //se volessi creare un evento del counter chiamerei il uuid del contatore
                /*case 'CLICK':
                    eventBus.on(`click-${rule.event.obj_uuid}`, function(){
                        let condition = evalCondition(rule.condition, me.state.runState);
                        if (condition) {
                            rule.actions.forEach(action => {
                                let actionExecution = actionCallback(action);
                                if (me.props.debug) {
                                    setTimeout(function () {
                                        interface_utils.highlightRule(me.props, me.props.interactiveObjects.get(rule.event.obj_uuid));
                                        eventBus.on('debug-step', actionExecution);
                                    }, duration);
                                } else {
                                    actionExecution();
                                }
                            });
                        }
                    });
                    rule.actions.forEach(action => {
                        //if(!eventBus._events['click-' + rule.event.obj_uuid]){
                        console.log("registering " + action.subj_uuid + " " + action.action + " " + action.obj_uuid);
                            eventBus.on('click-' + rule.event.obj_uuid, function () {
                                let condition = evalCondition(rule.condition, me.state.runState);
                                if (condition) {
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
                        //}
                    });
                    break;*/
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

                    //Gestione evento fine video, controllo che l'evento sia di fine video, e che il media esiste
                    if(rule.event.obj_uuid === "ENDED" && media){
                        media.onended = function() {
                            rule.actions.forEach(action => {
                                //Creo l'execution per ogni azione, la gestisco sia per in debugmode che in playmode
                                //Verifico che la condizione sia rispettata
                                if(evalCondition(rule.condition, me.state.runState)) {
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
                                        setTimeout(function () {
                                            actionExecution();
                                        }, media.duration);
                                    }
                                }
                            });
                        };
                    }

                    if(rule.event.obj_uuid === "STARTED" && media){
                        media.onplay = function() {
                            rule.actions.forEach(action => {
                                //Creo l'execution per ogni azione, la gestisco sia per in debugmode che in playmode
                                //Verifico che la condizione sia rispettata
                                if(evalCondition(rule.condition, me.state.runState)) {
                                    let actionExecution = actionCallback(action);
                                    if (me.props.debug) {
                                        setTimeout(function () {
                                            let object;
                                            if(me.props.interactiveObjects.get(rule.event.subj_uuid))
                                                object = me.props.interactiveObjects.get(rule.event.subj_uuid);
                                            else
                                                object = me.state.audios[rule.event.subj_uuid]
                                            interface_utils.highlightRule(me.props, object);
                                            eventBus.on('debug-step', actionExecution);
                                        }, duration);
                                    } else {
                                        setTimeout(function () {
                                            actionExecution();
                                        }, media.duration);
                                    }
                                }
                            });
                        };
                    }
                    break;

                default:
                    let eventName = rule.event.action.toLowerCase();
                    let event = `${rule.event.subj_uuid}-${eventName}-${rule.event.obj_uuid}`;
                    eventBus.on(event, function () {
                        let condition = evalCondition(rule.condition, me.state.runState);
                        if (condition) {
                            rule.actions.forEach(action => {
                                let actionExecution = actionCallback(action);
                                if (me.props.debug) {
                                    setTimeout(function () {
                                        interface_utils.highlightRule(me.props, me.props.interactiveObjects.get(rule.event.obj_uuid));
                                        eventBus.on('debug-step', actionExecution);
                                    }, duration);
                                } else {
                                    actionExecution();
                                }

                            });
                        }
                    });
                    if(rule.event.action==="ENTER_SCENE"){
                        eventBus.emit(event);
                    }
                    break;
            }
        })
    }


    /**
     * Funzione che Crea lo stato di gioco iniziaale, cicla tutte le scene e tutti gli oggetti all'interno di una scena
     * @param gameGraph Grafo con tutte le informazioni del gioco, scene, oggetti
     */
    createGameState(gameGraph){
        //
        //Salvo lo stato impostato dall'utente associato a uuid dell'oggetto, e lo sfondo per ogni scenea, questo
        //Servira quando si effettua un cambio sfondo, si aggiorna dentro questa struttura
        let runState = {};
        Object.values(gameGraph.scenes).forEach(scene => {
            //create the state for the scene
            runState[scene.uuid] = {background: scene.img};
            //create the state for all the objs in the scene
            Object.values(scene.objects).flat().forEach(obj => {
                runState[obj.uuid] = {state: obj.properties.state,
                    visible: obj.visible, activable: obj.activable,
                    step: obj.properties.step
                }
            });
        });

        return runState;
    }

    /**
     * Questa funzione si occupa di gestire il cambio bolla, aggiorna lo stato corrente della scena dopo una transizione
     * @param newActiveScene uuid della nuova scena correnteb
     */
    handleSceneChange(newActiveScene) {
        this.setState({
            scenes: this.props.scenes.toArray(),
            graph: this.state.graph,
            activeScene: this.state.graph.scenes[newActiveScene],
            //currentScene: this.state.graph.scenes[newActiveScene]
        });
        //qui faccio partire il video dopo il cambio di scena
        let sceneCanvas = document.getElementById(this.state.activeScene.name)
        //sceneCanvas.components["material"].data.src.play();
        console.log("scena cambiata")
        sceneLoaded = false;
        if(this.props.debug){
            this.props.updateCurrentScene(this.state.graph.scenes[newActiveScene].uuid);
        }
    }

    /**
     * Funzione che si occupa di gestire camera e cursore dopo il cambio da una scena 2D ad una 3D e viceversa
     * @param is3Dscene parametro che mi dice la tipologia della scena 2D o 3D
     */
    //[Vittoria] nella scena 2D la camera deve rimanere fissa, nelle scene 3D si deve muovere, nel 3D il raycaster è legato al cursore,
    // nel 2D alla "manina"
    cameraChangeMode(is3Dscene){
        let camera = document.getElementById('camera');
        let cursorMouse = document.getElementById('cursorMouse');
        let cursorEnity = document.getElementById('cursor');
        //Aggiorno le variabili planarScene, pointerLockEnabled all'interno del componente pac-look-controls editato da noi
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

    render(){
        console.log("nuova render");
        if(!this.state) return null;
        let sceneUuid = null;
        //Verifico se sono in debug mode e prendo la scena corrente di conseguenza
        if(this.props.debug){
            sceneUuid = this.props.currentScene;
        }else{
            sceneUuid = this.state.activeScene.uuid;
        }

        let textboxEntity = null;
        let textboxUuid = this.state.activeScene.objects.textboxes[0];
        let timerEntity = null;
        let timerUuid = this.state.activeScene.objects.timers[0];
        let gameTimeEntity = null;
        let gameTimeUuid = this.state.activeScene.objects.playtime[0];
        let scoreEntity = null;
        let scoreUuid = this.state.activeScene.objects.score[0];
        window.scoreValue = undefined;
        let healthEntity = null;
        let healtUuid = this.state.activeScene.objects.health[0];

        let graph = this.state.graph;

        //Verifico se esistano delle bolle vicina, se esistono le inserisco dentro currentLevel che esero' piu' avanti per popolare la scena
        //filtro eliminando la scena corrente in modo che non venga caricata due volte
        if (this.state.graph.neighbours !== undefined && graph.neighbours[sceneUuid] !== undefined) { //se la scena ha vicini
            this.currentLevel = Object.keys(graph.scenes).filter(uuid =>  //[Vittoria] filtro le scene e le prende tranne se stessa
                //this.state.graph.scenes[sceneUuid]);
                //se questo sistema non funziona, commentare la riga sopra e decommentare le 2 sotto
                graph.neighbours[sceneUuid].includes(uuid)
                || uuid === sceneUuid);
            // console.log("neighbours di sceneUuid: ", this.state.graph.neighbours[sceneUuid])

            let textObj = graph.objects.get(textboxUuid); //recupero l'oggetto di testo
            if (textObj == undefined)//per qualche motivo a volte è textboxUuid a contenere le proprietà dell'oggetto
                textObj = textboxUuid;

            let timerObj = graph.objects.get(timerUuid); //recupero l'oggetto timer
            if (timerObj == undefined)
                timerObj = timerUuid;

            let gameTimeObj = graph.objects.get(gameTimeUuid); //recupero l'oggetto gameTime
            if (gameTimeObj == undefined)
                gameTimeObj = gameTimeUuid;

            let scoreObj = graph.objects.get(scoreUuid);
            if (scoreObj == undefined)
                scoreObj = scoreUuid;

            let healthObj = graph.objects.get(healtUuid);
            if (healthObj == undefined)
                healthObj = healtUuid;


            if (textObj) //se l'oggetto textbox esiste genero la Entity
            {
                let textProperties = "baseline: center; side: double; wrapCount: "+ (100 - (textObj.properties.fontSize*5)) +
                    "; align: " + textObj.properties.alignment +
                    "; value:" + textObj.properties.string;
                let geometryProperties = "primitive: plane; width: " + (0.5 + (textObj.properties.boxSize/20))+
                    "; height: auto"
                let visibility = true; //per gestire la visibilità della textbox
                if (textObj.visible == 'INVISIBLE')
                    visibility = false;
                textboxEntity =
                    <Entity visible={true} geometry={geometryProperties} position={'0 -0.214 -0.3'}
                            id={this.state.activeScene.name + 'textbox'} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textProperties} visible={visibility}>
                    </Entity>
            }
            if (timerObj) //se l'oggetto timer esiste genero la Entity
            {
                timerSize = 0.4 + (timerObj.properties.size/20);
                if (timerID ==  this.state.activeScene.name + 'timer') {

                }
                else{
                    window.timerTime = timerObj.properties.time;
                    window.timerIsRunning = timerObj.properties.autoStart;
                    timerID =  this.state.activeScene.name + 'timer';
                }

                let textProperties = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + timerSize +
                    "; value:" + window.timerTime;
                let geometryProperties = "primitive: plane; width: 0.1" + (0.4 + timerSize)+
                    "; height: auto;"
                let visibility = true;
                if (timerObj.visible == 'INVISIBLE')
                    visibility = false;
                timerEntity =
                    <Entity visible={true} geometry={geometryProperties} position={'0 0.23 -0.3'}
                            id={timerID} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textProperties} visible={visibility}>
                    </Entity>
            }
            if (gameTimeObj) //se l'oggetto game time esiste genero la Entity
            {
                gameTimeSize = 0.4 + (gameTimeObj.properties.size/20);
                let textPropertiesPT = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + gameTimeSize +
                    "; value:" + window.gameTimeValue +
                    ";color: #dbdbdb";
                let geometryPropertiesPT = "primitive: plane; width: 0.12" + (0.4 + gameTimeSize)+
                    "; height: auto;"
                let visibility = true;
                if (gameTimeObj.visible == 'INVISIBLE')
                    visibility = false;
                gameTimeEntity =
                    <Entity visible={true} geometry={geometryPropertiesPT} position={'0.31 0.23 -0.3'}
                            id={this.state.activeScene.name + 'gameTime'} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textPropertiesPT} visible={visibility}>
                    </Entity>
            }
            if (scoreObj) //se l'oggetto score esiste genero la Entity
            {
                if (window.scoreValue == undefined)
                    window.scoreValue = 0;
                scoreSize = 0.1 + (scoreObj.properties.size/10);
                let textPropertiesSC = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + scoreSize +
                    "; value:" + window.scoreValue +
                    ";color: #dbdbdb";
                let geometryPropertiesSC = "primitive: plane; width: " + (0.05 + scoreSize/10)+
                    "; height:" + (0.02 + scoreSize/50) +";"
                let visibility = true;
                if (scoreObj.visible == 'INVISIBLE')
                    visibility = false;
                scoreEntity =
                    <Entity visible={true} geometry={geometryPropertiesSC} position={'-0.31 0.23 -0.3'}
                            id={this.state.activeScene.name + 'score'} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textPropertiesSC} visible={visibility}>
                    </Entity>
            }
            if (healthObj) //se l'oggetto health esiste genero la Entity
            {
                if (window.healthValue == undefined)
                    window.healthValue = healthObj.properties.health;
                healthSize = 0.1 + (healthObj.properties.size/10);
                let textPropertiesHL = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + healthSize +
                    "; value:" +window.healthValue +
                    ";color: #dbdbdb";
                let geometryPropertiesHL = "primitive: plane; width:" + (0.05 + healthSize/10) +
                    "; height:" + (0.02 + healthSize/50) +";"
                let visibility = true;
                if (healthObj.visible == 'INVISIBLE')
                    visibility = false;
                healthEntity =
                    <Entity visible={true} geometry={geometryPropertiesHL} position={'-0.31 0.19 -0.3'}
                            id={this.state.activeScene.name + 'health'} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textPropertiesHL} visible={visibility}>
                    </Entity>
            }

        }
        else
        {
            this.currentLevel = [];
        }
        //Richiamo la funzione per la generazione degli assets
        //[Vittoria] gli assets vengono caricati non tutti insieme all'inizio ma quello della scena corrente e dei vicini
        let assets = this.generateAssets(this.props.editor.gameId);
        let is3dScene = this.props.scenes.get(sceneUuid).type ===Values.THREE_DIM; //Variabile per sapere se la scena e' di tipo 2D o 3D
        let embedded = this.props.debug; //Varibile per sapere se siamo in debug mode
        let vr_mode_ui = this.props.debug ? "enabled : false": false;

        //<div id="mainscene2" tabIndex="0">
        //</div>
        //All'interno della render vengono caricati due tipi di cursori, uno per le scene 2D e uno per le scene 3D, quando si passa da una
        //all'altra si attivano e disattivano a seconda del tipo di scena
        //Sempre dentro la render viene richiamata la funzione generateBubbles che si occupa di creare tutte le bolle nella scena corrente
        return (
            //[Vittoria] <Scene, <a-assets sono un componenti e tag di React A-frame
            <Scene stats={!this.props.debug && this.state.stats} background="color: black" embedded={embedded} vr-mode-ui={vr_mode_ui}>
                <a-assets>
                    {assets}
                </a-assets>
                {this.generateBubbles()}

                <Entity primitive="a-camera" key="keycamera" id="camera"
                        pac-look-controls={"pointerLockEnabled: " + is3dScene.toString()+ ";planarScene:" + !is3dScene +";"}
                        look-controls="false" wasd-controls="false">

                    {textboxEntity}
                    {timerEntity}
                    {gameTimeEntity}
                    {scoreEntity}
                    {healthEntity}

                    <Entity primitive="a-cursor" id="cursorMouse" cursor={"rayOrigin: mouse" }
                            fuse={false}   visible={false} raycaster={"objects: [data-raycastable]; enabled: " + !is3dScene + ";"}/>
                    <Entity primitive="a-cursor" id="cursor" cursor={"rayOrigin: entity" }
                            fuse={false}   visible={is3dScene} raycaster={"objects: [data-raycastable]; enabled: " + is3dScene + ";"}/>
                </Entity>
            </Scene>

        )
    }

    /**
     * Funzione che si occupa di creare tutti gli assets delle bolle attualmente presenti nella scena, prese da currentLevel generato in precedenza
     * @param gameId codice gioco, serve per caricare tutti i dati partendo dal gioco piuttosto che dall'editor
     * @returns {any[]}
     */
    generateAssets(gameId){
        //[Vittoria] per ogni scena del current level richiama generateAssets
        return this.currentLevel.map(sceneName => {
            return (
                <Asset
                    scene = {this.state.graph.scenes[sceneName]}
                    srcBackground = {this.state.runState[sceneName].background}
                    runState = {this.state.runState}
                    audios= {this.state.audios}
                    mode = {'scene'}
                    gameId = {gameId}
                />
            );

            /* Decommentare nel caso in cui il componente Asset dia problemi
                return aframe_utils.generateAsset(this.state.graph.scenes[sceneName],
                this.state.runState[sceneName].background, this.state.runState, this.state.audios, 'scene', gameId)*/
        }).flat();
    }

    /**
     * Funzione che si occupa di creare le bolla all'interno della scena, le bolla create saranno quelle presenti dentro
     * currentLevel, verificando se la scena e' quella attiva oppure no.
     * @returns {*[]}
     */
    generateBubbles(){
        //Restituisco il codice React relativo ad ogni bolla da caricare nella scena
        return this.currentLevel.map(sceneName =>{
            let scene = this.state.graph.scenes[sceneName];
            let currentScene = this.props.debug ? this.props.currentScene : false;
            let isActive = this.props.debug? scene.uuid === this.props.currentScene : scene.name === this.state.activeScene.name;

            //Richiamo createRuleListeners per caricare gli eventi legati ai video, non posso farlo solo all'inizio perche'
            //i media non sono tutti presenti nella scena
            //TODO verificare che non generi piu' eventi legati ai video, quelli del click sono gia' verificati
            //TODO [davide] rimosso perche' crea più listener per lo stesso evento
            //this.createRuleListeners();
            //console.log("genero bolla: " ,scene.uuid)
            //Passo tutti i parametri al componente React Bubble, necessari al componente per la creazione della bolla
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
                        gameId={this.props.editor.gameId}
                />
            );
        });
    }

    updateAngles() {
        let cameraMatrix4 = document.querySelector('#camera').object3D.matrixWorld;
        resonance.default.setListenerFromMatrix(cameraMatrix4)
    }


    static timerStop() {
        window.timerIsRunning = false;

    }
    static timerStart() {
        window.timerIsRunning = true;
    }

    static changeTimerTime(time){
        window.timerTime = time;
    }

    //TODO: finire questi metodi
    static changeHealthValue(newHealthValue){
        let healthObj = null;
        //let healthObj = document.getElementById(this.state.activeScene.name + 'health')
        window.healthValue = newHealthValue;
        let textPropertiesHL = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + healthSize +
                "; value:" + window.healthValue +
                ";color: #dbdbdb";
        healthObj.setAttribute('text', textPropertiesHL);
    }

    //TODO: finire questi metodi
    static changeScoreValue(newScoreValue){
        let scoreObj = null;
        //let scoreObj = document.getElementById(this.state.activeScene.name + 'score')
        window.scoreValue = newScoreValue;
        let textPropertiesSC = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + scoreSize +
                "; value:" + window.scoreValue +
                ";color: #dbdbdb";
        scoreObj.setAttribute('text', textPropertiesSC);
        }
}