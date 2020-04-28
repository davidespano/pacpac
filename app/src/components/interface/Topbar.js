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
import Timer from "../../interactives/Timer";
import Score from "../../interactives/Score";
import Health from "../../interactives/Health";
import PlayTime from "../../interactives/PlayTime";
import Dropdown from "./Dropdown";
import FileSelectionBtn from "./FileSelectionBtn";



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
                           //let  result = rules_utils.checkCompletionsRules(props);
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
                                    //TODO decommentare quando il componente timer sarà pronto
                                    createObject(props, InteractiveObjectsTypes.TIMER);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.TIMER)}/>
                            <figcaption>Timer</figcaption>
                        </figure>

                    </div>
                </div>

                <div className={"tab-pane fade"}
                     id="nav-global" role="tabpanel" aria-labelledby="nav-objects-global">
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    //createObject(props, InteractiveObjectsTypes.HEALTH);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.HEALTH)}/>
                            <figcaption>Vita</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    //createObject(props, InteractiveObjectsTypes.SCORE);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.SCORE)}/>
                            <figcaption>Punteggio</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.PLAYTIME);
                                }}>
                            <img src={interface_utils.getObjImg(InteractiveObjectsTypes.PLAYTIME)}/>
                            <figcaption>Tempo in gioco</figcaption>
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

function handleNavbarSelection(props){
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


/**
 * Generates a new InteractiveObject with default values according to the given type and calls the function for stores
 * update (including association between scene and object and generation of the default rule)
 * @param props
 * @param type
 */
function createObject(props, type){
    if(props.currentScene != null){
        let scene = props.scenes.get(props.currentScene);
        let name = "";
        let obj = null;

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
                name = scene.name + '_kp' + (scene.objects.keypads.length + 1);
                obj = Keypad ({
                    uuid : uuid.v4(),
                    name : name,
                    properties: {
                        state: null,
                        inputSize: 3,
                        combination : [Math.floor(Math.random() * 1000)],
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
                    alert("Hai già un oggetto textbox in questa scena")
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
            case InteractiveObjectsTypes.SCORE:
                //TODO: creare quest'oggetto in ogni scena esistente
                //TODO: creando una nuova scena, se l'oggetto esiste viene aggiunto automaticamente alla scena
                if(scene.objects.score.length == 0) //ammesso un solo oggetto score per gioco
                {
                    name = scene.name + '_sc' + (scene.objects.score.length + 1);
                    obj = Score({
                        uuid: uuid.v4(),
                        name: name,
                        properties: {
                            score: 0,
                            size: 5,
                        }
                    });
                }
                else
                {
                    alert("Hai già l'oggetto Score nel gioco")
                    return;
                }
                break;
            case InteractiveObjectsTypes.HEALTH:
                //TODO: creare quest'oggetto in ogni scena esistente
                //TODO: creando una nuova scena, se l'oggetto esiste viene aggiunto automaticamente alla scena
                if(scene.objects.health.length == 0) //ammesso un solo oggetto health per gioco
                {
                    name = scene.name + '_hl' + (scene.objects.health.length + 1);
                    obj = Health({
                        uuid: uuid.v4(),
                        name: name,
                        properties: {
                            health: 100,
                            size: 5,
                        }
                    });
                }
                else
                {
                    alert("Hai già l'oggetto Health nel gioco")
                    return;
                }
                break;
            case InteractiveObjectsTypes.PLAYTIME:
                let sceneArray = props.scenes.toArray()
                if(scene.objects.playtime.length == 0) //ammesso un solo oggetto playtime per scena
                {
                    for (let i = 0, len = sceneArray.length; i < len; i++) {
                        name = sceneArray[i].name + '_pt' //TypeError: Cannot read property 'name' of null
                            obj = PlayTime({
                                uuid: uuid.v4(),//TODO: modificare con IDscenaPT per poterlo rintracciare nel db
                                name: name,
                                properties: {
                                    time: 0,
                                    size: 5,
                                }
                            })
                        if(sceneArray[i].objects.playtime.length == 0)
                        {
                            props.addNewObject(sceneArray[i], obj);
                        }
                    }
                    creatingGlobal = true;
                }
                else
                {
                    alert("Hai già l'oggetto Play time nel gioco")
                    return;
                }
                break;
            default:
                return;
        }

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
                // props.switchToGeometryMode();
            }
        }



    } else {
        alert('Nessuna scena selezionata!');
    }
}

/**
 * Creates global objects in the new scene if there are any in other scenes
 * @param props
 * @param scene
 * @param type
 */
export function createGlobalObjectForNewScene(props, scene, type) {
    console.log("sto creando oggetto globale per nuova scena");
    console.log(scene);
    if (scene != null) {
        console.log("scene != null");

        let name = "";
        let obj = null;
        switch (type) {
            case InteractiveObjectsTypes.PLAYTIME:
                let sceneArray = props.scenes.toArray()
                if (scene.objects.playtime.length == 0){ //ammesso un solo oggetto playtime per gioco
                    name = scene.name + 'pt';
                    obj = PlayTime({
                        uuid: uuid.v4(),
                        name: name,
                        properties: {
                            time: 0,
                            size: 5,
                        }
                    })
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
