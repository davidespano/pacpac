import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import rules_utils from "../../rules/rules_utils";
import Switch from "../../interactives/Switch";
import Key from "../../interactives/Key";
import Lock from "../../interactives/Lock";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import TagMenu from "./TagMenu";
import ActionTypes from "../../actions/ActionTypes";
import AuthenticationAPI from "../../utils/AuthenticationAPI";
import AudioMenu from "./AudioMenu";
import AudioForm from "./AudioForm";
import StoriesViewer from "./StoriesViewer";
import Keypad from "../../interactives/Keypad";
import InputSaveForm from "./InputSaveForm";
import PointOfInterest from "../../interactives/PointOfInterest";
import interface_utils from "./interface_utils";
import Counter from "../../interactives/Counter";
import Values from "../../rules/Values";
import Textbox from "../../interactives/Textbox";
import Button from "../../interactives/Button";
import Selector from "../../interactives/Selector";
import Timer from "../../interactives/Timer";
import Score from "../../interactives/Score";
import Health from "../../interactives/Health";
import Number from "../../interactives/Number";
import Flag from "../../interactives/Flag";
import PlayTime from "../../interactives/PlayTime";
import Dropdown from "./Dropdown";
import FileSelectionBtn from "./FileSelectionBtn";
import SceneAPI from "../../utils/SceneAPI";
import Orders from "../../data/Orders";
import {executeAction} from "../aframe/aframe_actions";



let uuid = require('uuid');

// codice tab trama
/**
 <a className="nav-item nav-link" id="nav-objects-story-editor" data-toggle="tab" href="#nav-story-editor" role="tab"
 aria-controls="nav-story-editor" aria-selected="false"
 onClick={() => {handleSwitchToStoryEditorMode(props)}}>Trama</a>

 <figure className={'nav-figures'} data-toggle="modal" data-target="#view-story-modal">
 <img src={"icons/icons8-stories-100.png"}/>
 <figcaption>Visualizza storie</figcaption>
 </figure>

 */

function TopBar(props){

    let isDebugActive = props.scenes.size > 0;

    let interestPoint = null;
    if(props.currentScene && props.scenes.get(props.currentScene).type === Values.THREE_DIM){
        interestPoint = <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.POINT_OF_INTEREST);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.POINT_OF_INTEREST)}/>
                            <figcaption>Punto di interesse</figcaption>
                        </figure>
    }

    return (

        <div className={'topbar'}>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="navbar-brand" onClick={() => {
                        window.localStorage.removeItem("gameID");
                        props.reset();
                        AuthenticationAPI.getUserDetail();
                    }}>PacPac</button>

                    <a className="nav-item nav-link active"
                       id="nav-game-tab" data-toggle="tab" href="#nav-game" role="tab" aria-controls="nav-game"
                       aria-selected="true" onClick={() => handleNavbarSelection(props)}>Gioco</a>

                    <a className="nav-item nav-link" id="nav-objects-tab" data-toggle="tab" href="#nav-objects" role="tab"
                       aria-controls="nav-objects" aria-selected="false" onClick={() => handleNavbarSelection(props)}>Oggetti</a>

                    <a className="nav-item nav-link" id="nav-objects-global" data-toggle="tab" href="#nav-global" role="tab"
                       aria-controls="nav-global" aria-selected="false" onClick={() => handleNavbarSelection(props)}>Globali</a>

                    <a className="nav-item nav-link" id="nav-objects-assets" data-toggle="tab" role="tab" href="#nav-assets"
                       aria-controls="nav-assets" aria-selected="false"
                       onClick={() => handleAssetsMode(props)}>Assets</a>

                    <a className={"nav-item nav-link " + debugCheck(isDebugActive)} id="nav-debug-tab" data-toggle="tab"
                       role="tab" href={'#' + debugLink(isDebugActive)} aria-controls={debugLink(isDebugActive)} aria-selected="false"
                       onClick={() => {
                           let  result = rules_utils.checkCompletionsRules(props);

                           if(result.length === 0){
                               if(isDebugActive){
                                   hideSaveIcon(false);
                                   deleteErrors("errorsDebug");
                                   handleDebugMode(props);
                               }
                           }
                           else{
                               generateErrors(result, "errorsDebug");
                           }

                       }} >Debug</a>

                    <a className="nav-item nav-link" id="nav-objects-play" data-toggle="tab" role="tab" href="#nav-playoff"
                       aria-controls="nav-playoff" aria-selected="false"
                       onClick={() => {
                           let  result = rules_utils.checkCompletionsRules(props);

                           if(result.length === 0){
                               deleteErrors("errorsPlay");
                               props.switchToPlayMode()
                           }
                           else{
                               generateErrors(result, "errorsPlay");
                               handleNavbarSelection(props);
                           }

                       }} >Play <img src={'icons/icons8-play-50.png'}
                                     alt={'avvia gioco'}
                                     className={'action-buttons'}/>
                    </a>


                    <div id={'topbar-game-title'} className={'navbar-brand'}>
                        {props.editor.gameTitle}
                    </div>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active flex-container" id="nav-game" role="tabpanel" aria-labelledby="nav-game-tab">
                    <InputSceneForm {...props} />
                    <TagMenu {...props}/>
                    <AudioMenu {...props}/>
                    <AudioForm {...props}/>
					<StoriesViewer {...props}/>

                    <div className={"flex-container"}>
                        <figure className={'nav-figures'} data-toggle="modal" data-target="#add-scene-modal"
                                onClick={() => props.selectMediaToEdit(null)}
                        >
                            <img src={"icons/icons8-add-image-100.png"}/>
                            <figcaption>Nuova scena</figcaption>
                        </figure>
                        <figure className={'nav-figures'} data-toggle="modal" data-target="#add-tag-modal">
                            <img src={"icons/icons8-tags-100.png"}/>
                            <figcaption>Gestisci etichette</figcaption>
                        </figure>
                        <figure className={'nav-figures'} data-toggle="modal" data-target="#manage-audio-modal" data-backdrop="false">
                            <img src={"icons/icons8-audio-100.png"}/>
                            <figcaption>Gestisci audio</figcaption>
                        </figure>
                        <figure className={'nav-figures'} onClick={()=> window.open("www.google.it", "_blank")}>
                            <img src={"icons/icons8-manuale-100.png"}/>
                            <figcaption>Video guida</figcaption>
                        </figure>
                    </div>
                </div>
                <div className={"tab-pane fade"}
                     id="nav-objects" role="tabpanel" aria-labelledby="nav-objects-tab">
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.TRANSITION);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.TRANSITION)}/>
                            <figcaption>Transizione</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.SWITCH);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.SWITCH)}/>
                            <figcaption>Interruttore</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.KEY);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.KEY)}/>
                            <figcaption>Chiave</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.LOCK);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.LOCK)}/>
                            <figcaption>Lucchetto</figcaption>
                        </figure>
                        {interestPoint}
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.COUNTER);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.COUNTER)}/>
                            <figcaption>Contatore</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.TEXTBOX);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.TEXTBOX)}/>
                            <figcaption>Testo</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.TIMER);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.TIMER)}/>
                            <figcaption>Timer</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.BUTTON);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.BUTTON)}/>
                            <figcaption>Pulsante</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.KEYPAD);
                                    //alert("Oggetto disponibile a breve")
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.KEYPAD)}/>
                            <figcaption>Tastierino</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.SELECTOR);
                                    //alert("Oggetto momentaneamente non disponibile")
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.SELECTOR)}/>
                            <figcaption>Selettore</figcaption>
                        </figure>
                    </div>
                </div>

                <div className={"tab-pane fade"}
                     id="nav-global" role="tabpanel" aria-labelledby="nav-objects-global">
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.HEALTH);
                                    createGlobalObjectForNewScene(props, props.scenes.get('ghostScene'), InteractiveObjectsTypes.HEALTH);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.HEALTH)}/>
                            <figcaption>Vita</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.SCORE);
                                    createGlobalObjectForNewScene(props, props.scenes.get('ghostScene'), InteractiveObjectsTypes.SCORE);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.SCORE)}/>
                            <figcaption>Punteggio</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.PLAYTIME);
                                    //TODO trovare un modo migliore per farlo, viene eseguito solo quando non ho la ghost scene
                                    createGlobalObjectForNewScene(props, props.scenes.get('ghostScene'), InteractiveObjectsTypes.PLAYTIME);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.PLAYTIME)}/>
                            <figcaption>Tempo in gioco</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    alert("Oggetto in fase di sviluppo")
                                    //createObject(props, InteractiveObjectsTypes.FLAG);
                                    //createGlobalObjectForNewScene(props, props.scenes.get('ghostScene'), InteractiveObjectsTypes.FLAG);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.FLAG)}/>
                            <figcaption>Dati booleani</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    alert("Oggetto in fase di sviluppo")
                                    //createObject(props, InteractiveObjectsTypes.NUMBER);
                                    //createGlobalObjectForNewScene(props, props.scenes.get('ghostScene'), InteractiveObjectsTypes.NUMBER);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.NUMBER)}/>
                            <figcaption>Dati numerici</figcaption>
                        </figure>
                    </div>
                </div>

                <div className={"tab-pane fade"}
                           id="nav-debug" role="tabpanel" aria-labelledby="nav-debug-tab">
                    <div className={"flex-container"}>
                        <figure id ="save-icon" className={'nav-figures'}
                                data-toggle="modal" data-target="#save-modal">

                            <img src={"icons/icons8-save-100.png"}/>
                            <figcaption>Salva</figcaption>
                        </figure>
                        <p id={"errors"}>Prima di continuare completa le seguenti regole:</p>
                        <div className="item">
                            <ul id={"errorsDebug"}>

                            </ul>
                        </div>
                        <InputSaveForm {...props}/>
                     </div>
                </div>
                <div className={"tab-pane fade"}
                     id="nav-playoff" role="tabpanel" aria-labelledby="nav-objects-play">
                    <div className={"flex-container"}>
                        <p id={"errors"}>Prima di continuare completa le seguenti regole:</p>
                        <div className="item">
                            <ul id={"errorsPlay"}>

                            </ul>
                        </div>
                    </div>
                </div>

                <div className={"tab-pane fade"} id="nav-graphview" role="tabpanel"> </div>
            </div>
        </div>
    );
}

/**
 * @param errors: array con gli errori da mostrare
 * @param id: id dell'ul a cui appenderli (play o debug)
 */
function generateErrors(errors, id){

    var mainList = document.getElementById(id); //cerco l'ul

    //se non elimino quelli già presenti ogni volta che premo il tab li riaggiunge
    deleteErrors(id);

    //nascondo l'icona di salvataggio in modalità debug, in modo che se ci sono errori non compaia
    hideSaveIcon(true);

    for(var i=0;i<errors.length;i++){
        var item = errors[i];
        var elem = document.createElement("li");
        elem.value=item[0];
        elem.innerHTML=item;

        mainList.appendChild(elem);

    }
}

//Mi serve per cancellare gli errori mostrati sulle regole vuote
function deleteErrors(id) {
    var mainList = document.getElementById(id);
    while(mainList.firstChild) mainList.removeChild(mainList.firstChild);
}

//mi serve per nascondere l'icona del salvataggio quando mostro gli errori
//e mostrare l'elemento <p> quando ci sono
function hideSaveIcon(hide){
    let icon = document.getElementById("save-icon")

    if(hide){
        icon.hidden=true;
        //rifaccio comparire la scritta se l'avevo nascosta
        document.getElementById("errors").hidden=false;
    }
    else {
        icon.hidden=false;
        document.getElementById("errors").hidden=true;
    }
}

export function handleNavbarSelection(props){
   // let items = document.getElementsByClassName("nav-item");
    if(props.editor.mode !== ActionTypes.EDIT_MODE_ON){
        props.switchToEditMode();
        document.getElementById("nav-tabContent").hidden = false;
    }
}

function handleAssetsMode(props){
    if(props.editor.mode !== ActionTypes.FILE_MANAGER_MODE_ON){
        props.switchToFileManager();
        document.getElementById("nav-tabContent").hidden = true;
    }
}

function handleDebugMode(props) {
    if(props.editor.mode !== ActionTypes.DEBUG_MODE_ON){
        /*if(props.scenes.size > 0){
            props.updateCurrentScene(props.scenes.toArray()[0].uuid);
        }*/
        props.switchToDebugMode();
        document.getElementById("nav-tabContent").hidden = false;
    }
}

export function handleGraphViewMode(props){
    if(props.editor.mode !== ActionTypes.GRAPH_VIEW_MODE_ON) {
        props.switchToGraphView();
        document.getElementById("nav-tabContent").hidden = true;
    }
}

/**
 * Generates a new InteractiveObject with default values according to the given type and calls the function for stores
 * update (including association between scene and object and generation of the default rule)
 * @param props
 * @param type
 */
export function createObject(props, type){
    if(props.currentScene != null){
        let scene = props.scenes.get(props.currentScene);
        let name = "";
        let obj = null;
        let creatingGlobal = false;
        let sceneArray = props.scenes.toArray()
        switch(type){
            case InteractiveObjectsTypes.TRANSITION:
                name = scene.name + '_tr' + (scene.objects.transitions.length + 1);
                obj = Transition({
                    uuid : uuid.v4(),
                    name : name,
                });
                break;
            case InteractiveObjectsTypes.SWITCH:
                name = scene.name + '_sw' + (scene.objects.switches.length + 1);
                obj = Switch({
                    uuid : uuid.v4(),
                    name : name,
                });
                break;
            case InteractiveObjectsTypes.KEY:
                name = scene.name + '_key' + (scene.objects.collectable_keys.length + 1);
                obj = Key ({
                    uuid : uuid.v4(),
                    name : name,
                });
                break;
            case InteractiveObjectsTypes.LOCK:
                name = scene.name + '_lk' + (scene.objects.locks.length + 1);
                obj = Lock ({
                    uuid : uuid.v4(),
                    name : name,
                });
                break;
            case InteractiveObjectsTypes.POINT_OF_INTEREST:
                name = scene.name + '_pi' + (scene.objects.points.length + 1);
                obj = PointOfInterest({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;
            case InteractiveObjectsTypes.COUNTER:
                name = scene.name + '_cn' + (scene.objects.points.length + 1);
                obj = Counter({
                    uuid: uuid.v4(),
                    name: name,
                });
                break;
            case InteractiveObjectsTypes.KEYPAD:
                if (scene.objects.keypads.length == 0){
                    name = scene.name + '_kp' + (scene.objects.keypads.length + 1);
                    obj = Keypad ({
                        uuid : uuid.v4(),
                        name : name,
                        properties: {
                            state: null,
                            buttonsValues: {},
                            combination : [Math.floor(Math.random() * 1000)],
                        }
                    });
                }
                else{
                    alert("Hai già un oggetto tastierino in questa scena")
                    return;
                }
                break;
            case InteractiveObjectsTypes.SELECTOR:
                name = scene.name + '_sl' + (scene.objects.selectors.length + 1);
                obj = Selector ({
                    uuid : uuid.v4(),
                    name : name,
                    properties: {
                        optionsNumber: 3,
                        state: 1,
                    }
                });
                break;
            case InteractiveObjectsTypes.BUTTON:
                name = scene.name + '_bt' + (scene.objects.buttons.length + 1);
                obj = Button ({
                    uuid : uuid.v4(),
                    name : name,
                    properties: {
                        keypadUuid: null,
                    }
                });
                break;
            case InteractiveObjectsTypes.TEXTBOX:
                if(scene.objects.textboxes.length == 0) //ammessa una sola textbox per scena
                {
                    name = scene.name + '_tx' + (scene.objects.textboxes.length + 1);
                    obj = Textbox({
                        uuid: uuid.v4(),
                        name: name,
                        properties: {
                            string: 'testo',
                            alignment: Values.TEXTLEFT,
                            fontSize: 5,
                            boxSize: 5,
                        }
                    });
                }
                else
                {
                    alert("Hai già un oggetto textbox in questa scena");
                    return;
                }
                break;
            case InteractiveObjectsTypes.TIMER:
                if(scene.objects.timers.length == 0) //ammesso un solo timer per scena al momento
                {
                    name = scene.name + '_tm' + (scene.objects.timers.length + 1);
                    obj = Timer({
                        uuid: uuid.v4(),
                        name: name,
                        properties: {
                            time: 10,
                            size: 5,
                            autoStart: false,
                        }
                    });
                }
                else
                {
                    alert("Hai già un oggetto timer in questa scena")
                    return;
                }
                break;
            case InteractiveObjectsTypes.FLAG:

                creatingGlobal = true;
                scene = props.scenes.get('ghostScene');
                if(scene == undefined){ //la ghost scene non esiste
                    //la creo
                    SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default',
                        Orders.CHRONOLOGICAL, props);
                    addFlagToScenes(sceneArray, props, obj, name)
                }
                //nel caso di nuovi giochi aggiungo l'oggetto globale a tutte le scene comprese la ghost
                else{
                    if(scene.objects.flags.length == 0) {
                        addFlagToScenes(sceneArray, props, obj, name)
                    }
                    else {
                        alert("Hai già l'oggetto Dati booleani nel gioco");
                        return;
                    }
                }
                break;
            case InteractiveObjectsTypes.NUMBER:
                creatingGlobal = true;
                scene = props.scenes.get('ghostScene');
                if(scene == undefined){ //la ghost scene non esiste
                    //la creo
                    SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default',
                        Orders.CHRONOLOGICAL, props);
                    addNumberToScenes(sceneArray, props, obj, name)
                }
                //nel caso di nuovi giochi aggiungo l'oggetto globale a tutte le scene comprese la ghost
                else{
                    if(scene.objects.numbers.length == 0) {
                        addNumberToScenes(sceneArray, props, obj, name)
                    }
                    else {
                        alert("Hai già l'oggetto Dati numerici nel gioco");
                        return;
                    }
                }
                break;
            case InteractiveObjectsTypes.SCORE:
                creatingGlobal = true;
                scene = props.scenes.get('ghostScene');
                if(scene == undefined){ //la ghost scene non esiste
                    //la creo
                    SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default',
                        Orders.CHRONOLOGICAL, props);
                    addScoreToScenes(sceneArray, props, obj, name)
                }
                //nel caso di nuovi giochi aggiungo l'oggetto globale a tutte le scene comprese la ghost
                else{
                    if(scene.objects.score.length == 0) {
                        addScoreToScenes(sceneArray, props, obj, name)
                    }
                    else {
                        alert("Hai già l'oggetto Score nel gioco");
                        return;
                    }
                }
                break;
            case InteractiveObjectsTypes.HEALTH:
                creatingGlobal = true;
                scene = props.scenes.get('ghostScene');
                if(scene == undefined){ //la ghost scene non esiste
                    //la creo
                    SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default',
                        Orders.CHRONOLOGICAL, props);
                    addHealthToScenes(sceneArray, props, obj, name, scene);
                }
                //nel caso di nuovi giochi aggiungo l'oggetto globale a tutte le scene comprese la ghost
                else{
                    if(scene.objects.health.length == 0) {
                        addHealthToScenes(sceneArray, props, obj, name, scene);
                    }
                    else {
                        alert("Hai già l'oggetto Health nel gioco");
                        return;
                    }
                }
                break;
            case InteractiveObjectsTypes.PLAYTIME:
                creatingGlobal = true;
                scene = props.scenes.get('ghostScene');
                //caso di vecchi giochi
                if(scene == undefined){ //la ghost scene non esiste
                    //la creo
                    SceneAPI.createScene('Ghost Scene', "null", 0, '2D', 'default',
                        Orders.CHRONOLOGICAL, props);
                    //aggiungo l'oggetto a tutte le scene (tranne la ghost scene perchè qui non c'è ancora)
                    addPlayTimeToScenes(sceneArray, props, obj, name)
                }
                //nel caso di nuovi giochi aggiungo l'oggetto globale a tutte le scene comprese la ghost
                else{
                    if(scene.objects.playtime.length == 0)
                    {
                        addPlayTimeToScenes(sceneArray, props, obj, name)
                    }
                    else
                    {
                        alert("Hai già l'oggetto Play time nel gioco");
                        return;
                    }
                }
                break;
            default:
                return;
        }

        //se gli oggetti non sono globali creo le regole di default
        //per l'oggetto vita (l'unico che ha una regola di default) la creo nello switch
        if (!creatingGlobal)
        {
            let defaultRule = rules_utils.generateDefaultRule(obj, scene);
            props.addNewObject(scene, obj);
            //il controllo serve per la textbox che non ha bisogno di regole e questa chiamata verrebbe effettuata con defaultrule a null
            if(defaultRule != null)
            {
                if(obj.type === InteractiveObjectsTypes.SWITCH || obj.type ===InteractiveObjectsTypes.TIMER){ //switches and timers have multiple default rules
                    props.addNewRule(scene, defaultRule[0]);
                    props.addNewRule(scene, defaultRule[1]);
                }else{
                    props.addNewRule(scene, defaultRule);
                }
            }
        }


    } else {
        alert('Nessuna scena selezionata!');
    }
}

function addPlayTimeToScenes(sceneArray, props, obj, name){
    for (let i = 0, len = sceneArray.length; i < len; i++) {
        if(sceneArray[i].objects.playtime.length == 0)
        {
            name = 'Tempo di gioco';
            obj = PlayTime({
                uuid: sceneArray[i].uuid+"_pt",
                name: name,
                properties: {
                    time: 0,
                    size: 5,
                }
            });
            props.addNewObject(sceneArray[i], obj);
        }
    }
}

function addHealthToScenes(sceneArray, props, obj, name, scene){
    //aggiungo l'oggetto a tutte le scene (tranne la ghost scene perchè qui non c'è ancora)
    for (let i = 0, len = sceneArray.length; i < len; i++) {
        if(sceneArray[i].objects.health.length == 0)
        {
            name = 'Vita';
            obj = Health({
                uuid: sceneArray[i].uuid+"_hl",
                name: name,
                properties: {
                    health: 100,
                    size: 5,
                }
            });
            props.addNewObject(sceneArray[i], obj);

        }
    }
    //per necessità se la ghost scene non è già stata creata non creo la regola della vita
    if(scene != undefined){
        //la vita è l'unico oggetto globale con una regola di default,
        //questo va fuori dal ciclo perchè deve generarla solo per la ghostScene
        let defaultRule = rules_utils.generateDefaultRule(obj, scene);
        props.addNewRule(scene, defaultRule);
    }
}

function addFlagToScenes(sceneArray, props, obj, name, scene){
    //aggiungo l'oggetto a tutte le scene (tranne la ghost scene perchè qui non c'è ancora)
    for (let i = 0, len = sceneArray.length; i < len; i++) {
            name = 'Booleani';
            obj = Flag({
                uuid: sceneArray[i].uuid+"_fl",
                name: name,
                properties: {
                    id: [uuid.v4()],
                    name: ["flag prova"],
                    value: [false],
                }
            });
            props.addNewObject(sceneArray[i], obj);
    }
}

function addNumberToScenes(sceneArray, props, obj, name, scene){
    //aggiungo l'oggetto a tutte le scene (tranne la ghost scene perchè qui non c'è ancora)
    for (let i = 0, len = sceneArray.length; i < len; i++) {
        name = "Numeri";
        obj = Number({
            uuid: sceneArray[i].uuid+"_nr",
            name: name,
            properties: {
                id: [],
                name: [],
                value: [],
            }
        });
        props.addNewObject(sceneArray[i], obj);
    }
}

function addScoreToScenes(sceneArray, props, obj, name){
    //aggiungo l'oggetto a tutte le scene (tranne la ghost scene perchè qui non c'è ancora)
    for (let i = 0, len = sceneArray.length; i < len; i++) {
        if(sceneArray[i].objects.score.length == 0)
        {
            name = 'Punteggio';
            obj = Score({
                uuid: sceneArray[i].uuid+"_sc",
                name: name,
                properties: {
                    score: 100,
                    size: 5,
                }
            });
            props.addNewObject(sceneArray[i], obj);
        }
    }
}
/**
 * Creates global objects in the new scene if there are any in other scenes
 * @param props
 * @param scene
 * @param type
 */
export function createGlobalObjectForNewScene(props, scene, type) {
    if (scene != null) {
        let name = "";
        let obj = null;
        let ghost = props.scenes.get('ghostScene')

        switch (type) {
            case InteractiveObjectsTypes.PLAYTIME:
                if (scene.objects.playtime.length == 0){ //ammesso un solo oggetto playtime per gioco
                    name = 'Tempo di gioco';
                    obj = PlayTime({
                        uuid: scene.uuid+"_pt",
                        name: name,
                        properties: {
                            time: 0,
                            size: 5,
                        }
                    });
                    props.addNewObject(scene, obj);
                }
                break;
            case InteractiveObjectsTypes.SCORE:
                if (scene.objects.score.length == 0){ //ammesso un solo oggetto score per gioco
                    name = 'Punteggio';
                    obj = Score({
                        uuid: scene.uuid+"_sc",
                        name: name,
                        properties: {
                            score: 0,
                            size: 5,
                        }
                    });
                    props.addNewObject(scene, obj);
                }
                break;
            case InteractiveObjectsTypes.HEALTH:
                if (scene.objects.health.length == 0){ //ammesso un solo oggetto health per gioco
                    name = 'Vita';
                    obj = Health({
                        uuid: scene.uuid+"_hl",
                        name: name,
                        properties: {
                            health: 0,
                            size: 5,
                        }
                    });
                    props.addNewObject(scene, obj);
                }
                break;
            case InteractiveObjectsTypes.FLAG:
                if (scene.objects.flags.length == 0){ //ammesso un solo oggetto flag per gioco
                    name = 'Booleani';
                    obj = Flag({
                        uuid: scene.uuid+"_fl",
                        name: name,
                        properties: props.scenes.first().objects.flags.properties,
                    });
                    props.addNewObject(scene, obj);
                }
                break;
            case InteractiveObjectsTypes.NUMBER:
                if (scene.objects.numbers.length == 0){ //ammesso un solo oggetto number per gioco
                    name = 'Numeri';
                    obj = Number({
                        uuid: scene.uuid+"_nr",
                        name: name,
                        properties: props.scenes.first().objects.numbers.properties
                    });
                    props.addNewObject(scene, obj);
                }
                break;
            default:
                return;
        }
    }
}

function handleSwitchToStoryEditorMode(props){
	if(props.editor.mode != ActionTypes.STORY_EDITOR_MODE_ON) {
		props.switchToStoryEditorMode();
		document.getElementById("nav-tabContent").hidden = true;
    }
}

function debugCheck(isDebugActive){
    return isDebugActive ? '' : 'debug-disabled';
}

function debugLink(isDebugActive){
    return isDebugActive ? 'nav-debug' : '';
}



export default TopBar;
