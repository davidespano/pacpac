import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import rules_utils from "../../interactives/rules/rules_utils";
import scene_utils from "../../scene/scene_utils";
import Switch from "../../interactives/Switch";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";

let uuid = require('uuid');

function TopBar(props){
    return (
        <div className={'topbar'}>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="navbar-brand">PacPac</a>
                    <a className="nav-item nav-link active"
                       id="nav-game-tab" data-toggle="tab" href="#nav-game" role="tab" aria-controls="nav-game"
                       aria-selected="true" onClick={() => handleNavbarSelection()}>Gioco</a>
                    <a className="nav-item nav-link" id="nav-objects-tab" data-toggle="tab" href="#nav-objects" role="tab"
                       aria-controls="nav-objects" aria-selected="false" onClick={() => handleNavbarSelection()}>Oggetti</a>
                    <a className={"nav-item navbar-toggler"} onClick={() => props.switchToPlayMode()}>PLAY</a>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active flex-container" id="nav-game" role="tabpanel" aria-labelledby="nav-game-tab">
                    <InputSceneForm {...props} />
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'} data-toggle="modal" data-target="#add-scene-modal">
                            <img src={"icons8-add-image-100.png"}/>
                            <figcaption>Nuova scena</figcaption>
                        </figure>
                    </div>
                </div>
                <div className="tab-pane fade" id="nav-objects" role="tabpanel" aria-labelledby="nav-objects-tab">
                    <div className={"flex-container"}>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.TRANSITION);
                                }}>
                            <img src={"icons8-add-one-way-transition-100.png"}/>
                            <figcaption>Transizione</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createObject(props, InteractiveObjectsTypes.SWITCH);
                                }}>
                            <img src={"icons8-toggle-on-filled-100.png"}/>
                            <figcaption>Interruttore</figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    );
}

function handleNavbarSelection(){
    let items = document.getElementsByClassName("nav-item");
    for(let i = 0; i < items.length; i++){
        if(items[i].getAttribute("aria-selected") === 'true'){
            items[i].setAttribute('color', '#EF562D !important');
        } else {
            items[i].setAttribute('color', '#FFFFFF');
        }
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
            default:
                return;
        }

        let defaultRule = rules_utils.generateDefaultRule(obj);
        props.addNewObject(scene, obj);
        props.addNewRule(scene, defaultRule);

        InteractiveObjectAPI.saveObject(scene, obj);
        InteractiveObjectAPI.saveRule(scene, defaultRule);

    } else {
        alert('Nessuna scena selezionata!');
    }
}

export default TopBar;