import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import rules_utils from "../../interactives/rules/rules_utils";
import scene_utils from "../../scene/scene_utils";

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
                                    createTransition(props);
                                    // selection object section in rightbar
                                    if(document.getElementById('nav-interactives-tab'))
                                        document.getElementById('nav-interactives-tab').click();
                                }}>
                            <img src={"icons8-add-one-way-transition-100.png"}/>
                            <figcaption>Transizione</figcaption>
                        </figure>
                        <figure className={'nav-figures'}
                                onClick={() => {
                                    createSwitch(props);
                                    // selection object section in rightbar
                                    if(document.getElementById('nav-interactives-tab'))
                                        document.getElementById('nav-interactives-tab').click();
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
 * Generates a new Transition with default values and calls the function for stores update (including association
 * between scene and object and generation of the default rule)
 * @param props
 */
function createTransition(props) {
    if(props.currentScene != null){

        let name = props.currentScene.name + '_tr' + (props.currentScene.objects.transitions.length + 1);
        let tr = Transition({
            uuid : uuid.v4(),
            name : name,
        });

        // generates default rule for the object
        let defaultRule = rules_utils.generateDefaultRule(tr);

        // updates stores with new object and rule
        props.addNewObject(props.currentScene, tr);
        props.addNewRule(props.currentScene, defaultRule);

        InteractiveObjectAPI.saveTransitions(props.currentScene, tr);
        InteractiveObjectAPI.saveRule(props.currentScene, defaultRule);

    } else {
        alert("Nessuna scena selezionata!");
    }
}

function createSwitch(props){

}

export default TopBar;