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
import RuleActionTypes from "../../rules/RuleActionTypes";
import ObjectsStore from "../../data/ObjectsStore";
import Action from "../../rules/Action";
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
let textboxEntity = null;
let textboxUuid;
let timerEntity = null;
let timerUuid;
let gameTimeEntity = null;
let gameTimeUuid;
let scoreEntity = null;
let scoreUuid;
let healthEntity = null;
let healtUuid;
let keypadUuid;
let selectorUuid;
let keypadList; //variabile utilizzata per la creazione delle regole del tastierino

//variabili del timer pubbliche perchè accedute da render e tick
window.keypadValue = {};
window.healthValue = undefined;
window.playtimeValue = undefined;
window.scoreValue = undefined;

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

    loadingManager() {
        let sphere = document.getElementById(this.state.activeScene.name)
        let loadingsphere = document.getElementById(this.state.activeScene.name + 'loading');
        if(!sceneLoaded){
            if (!sceneLoaded && stores_utils.getFileType(this.state.activeScene.img) === 'video') //sceneLoaded è impostato a false nella handleSceneChange
            {
                sphere.components["material"].data.src.play();//avvio il video della scena in cui sono entrato
                if (loadingsphere !=null && sphere.components["material"].data.src.currentTime > 0)
                {
                    loadingsphere.setAttribute('visible', 'false');
                }
                if (sphere.components["material"].data.src.currentTime > 1)
                {
                    //se la transizione è più lunga di un secondo potrebbe non funzionare
                    sceneLoaded = true;
                }
            }
            if (sceneLoaded) //quando la scena è caricata, rendo invisibile la bolla di caricamento
            {
                loadingsphere.setAttribute('visible', 'false');
                // al termine del video sollevo l'evento per essere gestito qualora ci sia una regola per fine video
                let media = sphere.components["material"].data.src
                media.onended = function () {
                    eventBus.emit(media.id + "-is-ENDED");
                }
            }
        }
        else{ // se la scena viene aggiornata perchè si utilizza un oggetto in scena, questo fa sparire la loading screen
            if(loadingsphere)//questo previene un crash nella debug mode
            {
                loadingsphere.setAttribute('visible', 'false');
            }
        }
    }

    timerManager() {
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
            }
            if(window.timerTime %  1 == 0)
            {
                eventBus.emit(timerUuid + "-"+"reach_timer-" + Math.floor(window.timerTime))
            }
        }
    }

    gameTimeManager() {
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
                "; value:" + (new Date(window.gameTimeValue * 1000).toISOString().substr(11, 8));
            gameTime.setAttribute('text', textProperties)

            if(window.gameTimeValue %  60 == 0)
            {
                console.log("GameTime-reach_minute-" + Math.floor(window.gameTimeValue)/60)
                eventBus.emit("GameTime-reach_minute-" + Math.floor(window.gameTimeValue)/60)
            }
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
            EditorState.debugRunState = runState;
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
        keypadList = [];

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
                    //Se e' coinvolto un cambio sfondo devo aspettare, in caso sia un video, che finisca, prima di avviare la prossima azione
                    if (action.action === 'CHANGE_BACKGROUND') {
                        objectVideo = document.getElementById(action.obj_uuid);
                    //} else if(action.action === "CHECK_KEYPAD"){
                    //    objectVideo = document.querySelector('#media0_' + action.obj_uuid);
                    } else{
                        objectVideo = document.querySelector('#media_' + action.obj_uuid);
                        if (objectVideo) {
                            duration = (objectVideo.duration * 1000);
                        }
                    }
                    duration = 100;
                    setTimeout(function () {
                        executeAction(me, rule, action)
                    }, duration);

                };
                return closure;
            };
            //console.log(rule)
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
                    if(document.getElementById(rule.event.subj_uuid))
                    {
                        media = document.getElementById(rule.event.subj_uuid)
                        //console.log(rule.event.subj_uuid)
                    }
                    if(document.getElementById(rule.event.uuid))
                    {
                        media = document.getElementById('media_' + rule.event.uuid);
                        //console.log('media_' + rule.event.uuid)
                    }
                    if(soundsHub["audios_"+ rule.event.subj_uuid] !== undefined){
                        //media = soundsHub["audios_"+ rule.event.subj_uuid];
                    }
                    // creo l'event handler per la fine del video
                    let eventVideoName = rule.event.action.toLowerCase();
                    //TODO: trovare un altro ID per questo tipo di eventi, potrebbe accadere che due scene diverse con
                    // lo stesso media e lo stesso tipo di regola creino un conflitto
                    let endVideoEvent = `${rule.event.subj_uuid}-${eventVideoName}-${rule.event.obj_uuid}`;
                    eventBus.on(endVideoEvent, function(){
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
                                    actionExecution();
                                }
                            }
                        });
                    });

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
                                                object = me.state.audios[rule.event.subj_uuid];
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
                    let object = me.props.interactiveObjects.get(rule.event.subj_uuid);
                    //caricamento eventi oggetti globali:

                    //tempo di gioco
                    if( object && object.type === InteractiveObjectsTypes.PLAYTIME){
                        event = `GameTime-reach_minute-${rule.event.obj_uuid}`;
                    }
                    //vita
                    if( object && object.type === InteractiveObjectsTypes.HEALTH){
                        event = `Health-value_changed_to-${rule.event.obj_uuid}`;
                    }
                    //punteggio
                    if( object && object.type === InteractiveObjectsTypes.SCORE){
                        event = `Score-value_changed_to-${rule.event.obj_uuid}`;
                    }

                    //se la regola è una regola di tastierino devo caricare anche tutti gli eventi relativi alla pressione
                    //dei pulsanti che fanno parte del tastierino
                    if(me.props.interactiveObjects.get(rule.event.obj_uuid) &&
                        me.props.interactiveObjects.get(rule.event.obj_uuid).type === InteractiveObjectsTypes.KEYPAD &&
                        rule.condition.obj_uuid === InteractiveObjectsTypes.COMBINATION){

                        eventBus.on(`PLAYER-click-${rule.event.obj_uuid}`, function () {
                            //qua devo mettere come actions il fatto che quando clicco il btn
                            // viene aggiornata la variabile con la combinazione cliccata dall'utente
                            let actionExecution = actionCallback(new Action({
                                uuid: null,
                                subj_uuid: "GAME",
                                action: "CHECK_KEYPAD",
                                obj_uuid: rule.event.obj_uuid,
                            }),);
                            actionExecution();
                        });

                        //inserisco nella keypadList ogni tastierino una sola volta e creo i suoi listener per i pulsanti
                        if(!keypadList.includes(rule.event.obj_uuid)){
                            keypadList.push(rule.event.obj_uuid);

                            let buttons = ObjectsStore.getState().get(rule.event.obj_uuid).properties.buttonsValues;
                            let buttons_objects = []; //elenco oggetti btn presenti nel tastierino
                            for(var i =0; i<Object.keys(buttons).length;i++){
                                let uuid = Object.keys(buttons)[i]; //uuid del btn
                                buttons_objects.push(ObjectsStore.getState().get(uuid));
                            }

                            for(var i =0; i<buttons_objects.length; i++){
                                let eventClick = `PLAYER-click-${buttons_objects[i].uuid}`;
                                let uuid=buttons_objects[i].uuid;
                                eventBus.on(eventClick, function () {
                                    //qua devo mettere come actions il fatto che quando clicco il btn
                                    // viene aggiornata la variabile con la combinazione cliccata dall'utente
                                    let actionExecution = actionCallback(new Action({
                                        uuid: null,
                                        subj_uuid: rule.event.obj_uuid, //come soggetto gli passo il tastierino
                                        action: "UPDATE_KEYPAD",
                                        obj_uuid: uuid,
                                    }),);
                                    actionExecution();

                                });
                            }
                        }
                    }

                    eventBus.on(event, function () {
                        let condition;

                        //ci sono due casi in cui mi serve necessariamente passare alla condition il tastierino:
                        // il giocatore clicca il tastierino, se la combinazione è giusta, allora ...
                        // il tastierino arriva a n cifre, se la combinazione è giusta, allora ...
                        // hanno in comune la condizione
                        if(rule.condition.obj_uuid === InteractiveObjectsTypes.COMBINATION){
                            //però in un caso il tastierino è l'oggetto dell'evento
                            if(me.props.interactiveObjects.get(rule.event.obj_uuid)){
                                if(me.props.interactiveObjects.get(rule.event.obj_uuid).type === InteractiveObjectsTypes.KEYPAD){
                                    condition = evalCondition(rule.condition, me.state.runState, me.props.interactiveObjects.get(rule.event.obj_uuid));
                                }
                            }
                            //nell'altro è il soggetto
                            else if (me.props.interactiveObjects.get(rule.event.subj_uuid).type === InteractiveObjectsTypes.KEYPAD &&
                                rule.event.action === RuleActionTypes.REACH_KEYPAD) {
                                condition = evalCondition(rule.condition, me.state.runState, me.props.interactiveObjects.get(rule.event.subj_uuid));
                            }

                        }else{
                            condition = evalCondition(rule.condition, me.state.runState);
                        }
                        if (condition) {
                            rule.actions.forEach(action => {
                                let actionExecution = actionCallback(action);
                                if (me.props.debug) {
                                    setTimeout(function () {
                                        interface_utils.highlightRule(me.props, me.props.interactiveObjects.get(rule.event.obj_uuid));
                                        eventBus.on('debug-step', actionExecution);
                                    }, duration);
                                }
                                else {
                                    actionExecution();
                                }

                            });
                        }
                    });
                    if(rule.event.action==="ENTER_SCENE" && me.props.currentScene == rule.event.obj_uuid){
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
        //console.log("scena cambiata")
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
        if(!this.state) return null;
        let sceneUuid = null;
        //Verifico se sono in debug mode e prendo la scena corrente di conseguenza
        if(this.props.debug){
            sceneUuid = this.props.currentScene;
        }else{
            sceneUuid = this.state.activeScene.uuid;
        }

        let ghostSceneUuid = 'ghostScene';
        textboxEntity = null;
        textboxUuid = this.state.activeScene.objects.textboxes[0];
        timerEntity = null;
        timerUuid = this.state.activeScene.objects.timers[0];
        gameTimeEntity = null;
        gameTimeUuid = this.state.activeScene.objects.playtime[0];
        scoreEntity = null;
        scoreUuid = this.state.activeScene.objects.score[0];
        healthEntity = null;
        healtUuid = this.state.activeScene.objects.health[0];
        keypadUuid =  this.state.activeScene.objects.keypads[0];
        selectorUuid = this.state.activeScene.objects.selectors[0];


        let graph = this.state.graph;
        //TODO: le scene neighbour della ghost scene devono essere renderizzate una sola volta se possibile
        //Verifico se esistano delle bolle vicina, se esistono le inserisco dentro currentLevel che esero' piu' avanti per popolare la scena
        //filtro eliminando la scena corrente in modo che non venga caricata due volte
        if (this.state.graph.neighbours !== undefined && graph.neighbours[sceneUuid] !== undefined) { //se la scena ha vicini
            if(graph.neighbours[ghostSceneUuid]){
                this.currentLevel = Object.keys(graph.scenes).filter(uuid =>  //[Vittoria] filtro le scene e le prende tranne se stessa
                    //se questo sistema non funziona, commentare la riga sopra e decommentare le 3 sotto
                    graph.neighbours[sceneUuid].includes(uuid)
                    || uuid === sceneUuid
                    || graph.neighbours[ghostSceneUuid].includes(uuid)); //includo i vicini della ghostscene
            }
            else{ //se la ghost scene non è stata ancora creata
                this.currentLevel = Object.keys(graph.scenes).filter(uuid =>  //[Vittoria] filtro le scene e le prende tranne se stessa
                    //se questo sistema non funziona, commentare la riga sopra e decommentare le 3 sotto
                    graph.neighbours[sceneUuid].includes(uuid)
                    || uuid === sceneUuid);
            }

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

            let keypadObj = graph.objects.get(keypadUuid);
            if (keypadObj == undefined)
                keypadObj = keypadUuid;

            if (keypadObj){
                if(!window.keypadValue[keypadUuid]){
                    window.keypadValue[keypadUuid] = "";
                }
            } //inizializzo il valore del tastierino se è la prima volta che lo incontro

            let selectorObj = graph.objects.get(selectorUuid);
            if (selectorObj == undefined)
                selectorObj = selectorUuid;

            //TODO: i caratteri accentati non vengono visualizzati, cambiare font non sembra funzionare
            if (textObj) {//se l'oggetto textbox esiste genero la Entity
                let textProperties = "baseline: center; side: double; wrapCount: "+ (100 - (textObj.properties.fontSize*4)) +
                    "; align: " + textObj.properties.alignment +
                    "; value:" + textObj.properties.string;
                let geometryProperties = "primitive: plane; width: " + (0.25 + (textObj.properties.boxSize/15))+
                    "; height: " + (0.01 + textObj.properties.boxSize/100)
                let visibility = true; //per gestire la visibilità della textbox
                if (textObj.visible == 'INVISIBLE')
                    visibility = false;
                textboxEntity =
                    <Entity geometry={geometryProperties} position={'0 -0.20 -0.3'}
                            id={this.state.activeScene.name + 'textbox'} material={'shader: flat; opacity: 0.85; color: black;'}
                            text={textProperties} visible={visibility}>
                    </Entity>
            }
            if (timerObj) { //se l'oggetto timer esiste genero la Entity
                timerSize = 0.2 + (timerObj.properties.size/15);
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
                let geometryPropertiesTM = "primitive: plane; width:" + (timerSize/8)+
                    "; height: auto;"
                let timerPosition = '0.13 0.23 -0.3'
                let timerImgPosition = 0.15 + (0.005 * timerObj.properties.size) +" 0.23 -0.3"
                let geometryPropertiesTMimg = "" + (timerSize/30) + " " + (timerSize/30) + " " +
                    (timerSize/30)
                let visibility = true;
                if (timerObj.visible == 'INVISIBLE')
                    visibility = false;
                timerEntity =
                    <Entity>
                        <a-plane id={this.state.activeScene.name + 'timerIMG'}
                        src={interface_utils.getObjImg(InteractiveObjectsTypes.TIMER)} position={timerImgPosition}
                                 scale={geometryPropertiesTMimg}  emissive={"#cecece"} emissiveIntensity="0.8"
                                 blending={"subtractive"} color={"#000000"} opacity="0.8" visible={visibility}/>                          <Entity visible={true} geometry={geometryPropertiesTM} position={timerPosition}
                                id={timerID} material={'shader: flat; opacity: 0.85; color: black;'}
                                text={textProperties} visible={visibility}>
                        </Entity>
                    </Entity>
            }
            if (gameTimeObj) { //se l'oggetto game time esiste genero la Entity
                gameTimeSize = 0.2 + (gameTimeObj.properties.size/15);
                let textPropertiesPT = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + gameTimeSize +
                    "; value:" + window.gameTimeValue +
                    ";color: #dbdbdb";
                let geometryPropertiesPT = "primitive: plane; width:" + (gameTimeSize/5) +
                    "; height: auto;"
                let positionPT = "0.375 0.23 -0.3"
                let geometryPropertiesPTimg = "" + (gameTimeSize/30) + " " + (gameTimeSize/30) + " " +
                    (gameTimeSize/30)
                let positionPTimg = 0.40 + (0.008 * gameTimeObj.properties.size) +" 0.23 -0.3"
                let visibility = true;
                if (gameTimeObj.visible == 'INVISIBLE')
                    visibility = false;
                gameTimeEntity =
                    <Entity>
                        <a-plane id={this.state.activeScene.name + 'gametimeIMG'}
                        src={interface_utils.getObjImg(InteractiveObjectsTypes.PLAYTIME)} position={positionPTimg}
                                 scale={geometryPropertiesPTimg}  emissive={"#cecece"} emissiveIntensity="0.8"
                                 blending={"subtractive"} color={"#000000"} opacity="0.8" visible={visibility}/>                        <Entity visible={true} geometry={geometryPropertiesPT} position={positionPT}
                                id={this.state.activeScene.name + 'gameTime'} material={'shader: flat; opacity: 0.85; color: black;'}
                                text={textPropertiesPT} visible={visibility}>
                        </Entity>
                    </Entity>
            }
            if (scoreObj) { //se l'oggetto score esiste genero la Entity
                if (window.scoreValue == undefined)
                    window.scoreValue = 0;
                scoreSize = 0.2 + (scoreObj.properties.size/15);
                let textPropertiesSC = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + scoreSize +
                    "; value:" + window.scoreValue +
                    ";color: #dbdbdb";
                let geometryPropertiesSC = "primitive: plane; width: " + (scoreSize/8)+
                    "; height:" + (scoreSize/22) +";"
                let positionSC = "-0.13 0.23 -0.3"
                let geometryPropertiesSCimg = "" + (scoreSize/30) + " " + (scoreSize/30) + " " +
                    (scoreSize/30)
                let positionSCimg = -(0.15) - (0.005 * scoreObj.properties.size) +" 0.23 -0.3"
                let visibility = true;
                if (scoreObj.visible == 'INVISIBLE')
                    visibility = false;
                scoreEntity =
                    <Entity>
                        <a-plane id={this.state.activeScene.name + 'scoreIMG'}
                        src={interface_utils.getObjImg(InteractiveObjectsTypes.SCORE)} position={positionSCimg}
                                 scale={geometryPropertiesSCimg}  emissive={"#cecece"} emissiveIntensity="0.8"
                                 blending={"subtractive"} color={"#000000"} opacity="0.8" visible={visibility}/>
                        <Entity visible={true} geometry={geometryPropertiesSC} position={positionSC}
                                id={this.state.activeScene.name + 'score'} material={'shader: flat; opacity: 0.8; color: black;'}
                                text={textPropertiesSC} visible={visibility}>
                        </Entity>
                    </Entity>
            }
            if (healthObj) { //se l'oggetto health esiste genero la Entity
                if (window.healthValue == undefined)
                    window.healthValue = healthObj.properties.health;
                healthSize = 0.2 + (healthObj.properties.size/15);
                let textPropertiesHL = "baseline: center; side: double"+
                    "; align: center" +
                    "; width:" + healthSize +
                    "; value:" + window.healthValue +
                    ";color: #dbdbdb";
                let geometryPropertiesHL = "primitive: plane; width:" + (healthSize/8) +
                    "; height:" + (healthSize/25) +";"
                let positionHL = "-0.375 0.23 -0.3"
                let geometryPropertiesHLimg = "" + (healthSize/30) + " " + (healthSize/30) + " " +
                    (healthSize/30)
                let positionHLimg = -(0.395) - (0.005 * healthObj.properties.size) +" 0.23 -0.3"
                let visibility = true;
                if (healthObj.visible == 'INVISIBLE')
                    visibility = false;
                healthEntity =
                    <Entity>
                        <a-plane id={this.state.activeScene.name + 'healthIMG'}
                        src={interface_utils.getObjImg(InteractiveObjectsTypes.HEALTH)} position={positionHLimg}
                        scale={geometryPropertiesHLimg}  emissive={"#cecece"} emissiveIntensity="0.8"
                        blending={"subtractive"} color={"#000000"} opacity="0.8" visible={visibility}/>
                        <Entity visible={true} geometry={geometryPropertiesHL} position={positionHL}
                                id={this.state.activeScene.name + 'health'} material={'shader: flat; opacity: 0.85; color: black;'}
                                text={textPropertiesHL} visible={visibility}>
                        </Entity>
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
        let otherAssets = this.generateOtherAssets(this.props.editor.gameId);
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
                    {otherAssets}
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
        //questo crea l'asset a frame della scena e delle adiacenti
        return this.currentLevel.map(sceneName => {
            return (
                <Asset
                    key={sceneName}
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
     * questa funzione serve a creare gli asset per le regole dei cambi di sfondo
     * normalmente venivano caricati assieme alla scena contenente la regola e persi subito dopo
     * può essere resa più efficente se aggiungo solo i media delle regole appartenenti al currentlevel
     * ma funziona bene anche così, don't fix it until is broken
     * @param gameId
     * @returns {[]}
     */
    generateOtherAssets(gameId){
        let otherAssets=[];
        if (this.state.graph.scenes == undefined)
            return otherAssets;
        let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

        Object.values(this.state.graph.scenes).flatMap(s => s.rules).forEach(rule => {
            rule.actions.forEach(action => {
                if (action.action === 'CHANGE_BACKGROUND') {
                    if (stores_utils.getFileType(action.obj_uuid) === 'video') {
                        otherAssets.push(
                            <video id={action.obj_uuid} key={"key" + action.obj_uuid}
                                   src={`${mediaURL}${id}/` + action.obj_uuid}
                                   preload="auto" loop={'true'} crossOrigin="Anonymous" playsInline={true}
                                   muted={true}
                            />
                        )
                    } else {
                        otherAssets.push(<img id={action.obj_uuid} key={"key" + action.obj_uuid}
                                              crossOrigin="Anonymous"
                                              src={`${mediaURL}${id}/` + action.obj_uuid}
                        />)
                    }
                }
            })
        });
        return otherAssets;
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

    //Metodi visibilità UI
    static textboxChangeVisibility(activeSceneName, visibility){
        let textboxObj = document.getElementById(activeSceneName + 'textbox');
        textboxObj.setAttribute('visible', visibility);
    }

    static timerChangeVisibility(activeSceneName, visibility){
        let textboxObj = document.getElementById(activeSceneName + 'timer');
        textboxObj.setAttribute('visible', visibility);
    }

    static healthChangeVisibility(activeSceneName, visibility){
        let healthObj = document.getElementById(activeSceneName + 'health')
        healthObj.setAttribute('visible', visibility);
    }

    static scoreChangeVisibility(activeSceneName, visibility){
        let scoreObj = document.getElementById(activeSceneName + 'score')
        scoreObj.setAttribute('visible', visibility);
    }

    static playTimeChangeVisibility(activeSceneName, visibility){
        let playtimeObj = document.getElementById(activeSceneName + 'gameTime');
        playtimeObj.setAttribute('visible', visibility);
    }


    //Metodi timer
    static timerStop() {
        window.timerIsRunning = false;

    }

    static timerStart() {
        window.timerIsRunning = true;
    }

    static changeTimerTime(time){
        window.timerTime = time;
    }


    //Metodi vita
    static increaseHealthValue(increaseBy, activeSceneName)
    {
        let sum = window.healthValue + increaseBy;
        this.changeHealthValue(sum, activeSceneName);
        eventBus.emit("Health-value_changed_to-" + window.healthValue)
    }

    static decreaseHealthValue(decreaseBy, activeSceneName)
    {
        let sub = window.healthValue - decreaseBy;
        this.changeHealthValue(sub, activeSceneName);
        eventBus.emit("Health-value_changed_to-" + window.healthValue)
    }

    static changeHealthValue(newHealthValue, activeSceneName){
        let healthObj = document.getElementById(activeSceneName + 'health')
        if (healthObj !=null){
            window.healthValue = newHealthValue;
            let textPropertiesHL = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + healthSize +
                "; value:" + window.healthValue +
                ";color: #dbdbdb";
            healthObj.setAttribute('text', textPropertiesHL);
            eventBus.emit("Health-value_changed_to-" + window.healthValue)
        }
    }


    //Metodi punteggio
    static increaseScoreValue(increaseBy, activeSceneName)
    {
        let sum = window.scoreValue + increaseBy;
        this.changeScoreValue(sum, activeSceneName);
        eventBus.emit("Score-value_changed_to-" + window.scoreValue)
    }

    static decreaseScoreValue(decreaseBy, activeSceneName)
    {
        let sub = window.scoreValue - decreaseBy;
        this.changeScoreValue(sub, activeSceneName);
        eventBus.emit("Score-value_changed_to-" + window.scoreValue)
    }

    static changeScoreValue(newScoreValue, activeSceneName){
        let scoreObj = document.getElementById(activeSceneName + 'score')
        if (scoreObj != null){
            window.scoreValue = newScoreValue;
            let textPropertiesSC = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + scoreSize +
                "; value:" + window.scoreValue +
                ";color: #dbdbdb";
            scoreObj.setAttribute('text', textPropertiesSC);
            eventBus.emit("Score-value_changed_to-" + window.scoreValue)
        }
    }


    //Metodi tempo di gioco
    static changePlaytimeValue(newPlaytimeValue, activeSceneName){
        let playtimeObj = document.getElementById(activeSceneName + 'gameTime');
        if(playtimeObj != null){
            window.gameTimeValue = newPlaytimeValue *60;
            let textPropertiesPT = "baseline: center; side: double"+
                "; align: center" +
                "; width:" + gameTimeSize +
                "; value:" + (window.gameTimeValue) +
                ";color: #dbdbdb";
            playtimeObj.setAttribute('text', textPropertiesPT);
        }
    }


    //Metodi tastierino
    static updateKeypadValue(newNumber, keypadUuid){
        if(!window.keypadValue[keypadUuid] || window.keypadValue[keypadUuid] == null ||
            window.keypadValue[keypadUuid] == "t" || window.keypadValue[keypadUuid] == "f"){
            window.keypadValue[keypadUuid] = "";
        }
        //valore cliccato
        window.keypadValue[keypadUuid] = window.keypadValue[keypadUuid].concat(newNumber);
        //console.log("nuovo valore tastierino: ", window.keypadValue[keypadUuid])

    }

    static checkKeypadValue(keypadObj){
        //keypadObj.combination contiene la combinazione corretta
        //window.keypadValue contiene la combinazione cliccata dall'utente
        //TODO: se si hanno due regole di check sul tastierino, dopo la prima, il valore viene resettato, quindi il secondo controllo fallisce
        let k;
        //A seconda della regola, lo uuid potrebbe essere nella obj_uuid o nella uuid
        console.log("check value ", window.keypadValue[keypadObj.uuid])
        if(keypadObj.uuid == null){
            k = keypadObj.obj_uuid;
        }
        else
        {
            k = keypadObj.uuid
        }
        //Controllo se il codice inserito corrisponde o se arrivo da uno stato di codice corretto ("t"), o errato ("f")
        //il reset del codice inserito è stato spostato nella updateKeypadValue solo quando trovo "t" o "f" come stringa
        //Altrimenti mettendo il reset qui, se ci sono due regole di fila che usano il check, la seconda darà sempre esito errato
        if (keypadObj.properties.combination == window.keypadValue[k] || window.keypadValue[k] == "t") {
            window.keypadValue[k] = "t"; //anche se il codice è giusto resetto la variabile per le prossime combinazioni
            console.log("codice corretto: ", keypadObj.properties.combination);
            return true;
        }
        else {
            console.log("il codice che hai inserito è errato: ", window.keypadValue[k]);
            window.keypadValue[k] = "f"; //se il codice è sbagliato resetto il valore inserito dall'utente
            window.keypadWrong = true;
            return false;
        }
    }

    static checkKeypadValueLength(keypadObj){
        if(keypadObj.properties.combination.length == window.keypadValue[keypadObj.uuid].length){
            return true
        }
        else
        {
            return false;
        }
    }

    //Metodo selettore
    static nextSelectorState(VRScene, runState, game_graph, selectorObj, activeSceneName){ //da chiamare al click del selettore
        selectorObj.properties.state+=1;
        if(selectorObj.properties.state>selectorObj.properties.optionsNumber)
            selectorObj.properties.state=1; //il primo stato è 1
        console.log("Nuovo stato del selettore:",selectorObj.properties.state)

        document.getElementById(activeSceneName).needShaderUpdate = true;

        VRScene.setState({runState: runState, graph: game_graph});

    }
}