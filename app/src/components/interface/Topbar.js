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
                    <a className="nav-item nav-link" id="nav-objects-assets" data-toggle="tab" role="tab" href="#nav-assets"
                       aria-controls="nav-assets" aria-selected="false"
                       onClick={() => handleAssetsMode(props)}>Assets</a>
                    <a className={"nav-item nav-link " + debugCheck(isDebugActive)} id="nav-debug-tab" data-toggle="tab"
                       role="tab" href={'#' + debugLink(isDebugActive)} aria-controls={debugLink(isDebugActive)} aria-selected="false"
                       onClick={() => {
                           if(isDebugActive){
                               handleDebugMode(props);
                           }
                       }} >Debug</a>
                    <a className="nav-item nav-link" id="nav-objects-play" data-toggle="tab" role="tab" href="#nav-play"
                       aria-controls="nav-play" aria-selected="false"
                       onClick={() => {props.switchToPlayMode()}} >Play <img src={'icons/icons8-play-50.png'}
                                                                             alt={'avvia gioco'}
                                                                             className={'action-buttons'}/>
                    </a>
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
                    </div>
                </div>
                <div className={"tab-pane fade"}
                     id="nav-debug" role="tabpanel" aria-labelledby="nav-debug-tab">
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'}
                                data-toggle="modal" data-target="#save-modal">

                            <img src={"icons/icons8-save-100.png"}/>
                            <figcaption>Salva</figcaption>
                        </figure>
                        <InputSaveForm {...props}/>
                    </div>
                </div>
            </div>
        </div>
    );
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
        if(props.scenes.size > 0){
            props.updateCurrentScene(props.scenes.toArray()[0].uuid);
        }
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
            default:
                return;
        }

        let defaultRule = rules_utils.generateDefaultRule(obj);
        props.addNewObject(scene, obj);

        if(obj.type === InteractiveObjectsTypes.SWITCH){ //switches have multiple default rules
            props.addNewRule(scene, defaultRule[0]);
            props.addNewRule(scene, defaultRule[1]);
        }else{
            props.addNewRule(scene, defaultRule);
        }

    } else {
        alert('Nessuna scena selezionata!');
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