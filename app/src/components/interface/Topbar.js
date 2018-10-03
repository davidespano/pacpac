import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";
import MyScene from "../../scene/MyScene";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";

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
                        <figure className={'nav-figures'} onClick={() => {createTransition(props)}}>
                            <img src={"icons8-add-one-way-transition-100.png"}/>
                            <figcaption>Transizione</figcaption>
                        </figure>
                        <figure className={'nav-figures'} onClick={() => {createSwitch(props)}}>
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

function createTransition(props) {
    if(props.currentScene != null){

        let name = props.currentScene.name + '_tr' + (props.currentScene.transitions.length + 1);
        let tr = new Transition(name);

        Actions.updateDatalist(tr.uuid, tr);
        rulesToDatalist(tr,props);

        let newScene = new MyScene(
            props.currentScene.img,
            props.currentScene.type,
            props.currentScene.tagName,
            props.currentScene.tagColor,
            props.currentScene.transitions,
        );

        newScene.addNewTransitionToScene(tr);
        props.addNewTransition(newScene, tr);
        InteractiveObjectAPI.saveTransitions(newScene, tr);

    } else {
        alert("Nessuna scena selezionata!");
    }
}

function createSwitch(props){

}

function rulesToDatalist(object,props){
    object.rules.forEach((rule) => {props.updateDatalist(rule.uuid, object.uuid)} )
}

export default TopBar;


// function TopBar(props){
//     return (
//         <div className={'topbar'}>
//             <nav className="navbar  navbar-light">
//                 <a className="navbar-brand">PacPac</a>
//                 <InputSceneForm {...props} />
//                 <ul className={"nav"}>
//                     <li className="nav-item dropdown">
//                         <a className={"nav-item navbar-toggler"} onClick={() => props.switchToPlayMode()}>PLAY</a>
//                     </li>
//                 <li className="nav-item dropdown">
//                 <a className={"dropdown-toggle navbar-toggler"}  data-toggle="dropdown" role={"button"} aria-haspopup="true" aria-expanded="false">Edit Scene</a>
//                 <div className="dropdown-menu">
//                     <a className="dropdown-item" data-toggle="modal" data-target="#exampleModal">
//                         AddScene
//                     </a>
//                     <a className={"dropdown-item"} id={'remove_scene'}
//                        title={'Rimuovi una scena'}
//                        onClick={() => {
//                            if(props.currentScene != null){
//                                SceneAPI.deleteScene(props.currentScene);
//                                props.updateCurrentScene(null);
//                                props.updateCurrentObject(null);
//                            }
//                            else{
//                                alert("Devi aver già selezionato la scena da rimuovere.")
//                            }
//                        }}
//                     >RemoveScene</a>
//                     <a className={"dropdown-item"} id={'remove_scene'}
//                        title={'Rimuovi una scena'}
//                        onClick={() => {
//                                props.removeAllScene();
//                                props.updateCurrentScene(null);
//                                console.log(props.scenes);
//                                props.updateCurrentObject(null);
//                        }}
//                     >RemoveALL</a>
//                 </div>
//                 </li>
//                 </ul>
//                 <ul className={"nav"}>
//                     <li className="nav-item dropdown">
//                         <a className={"dropdown-toggle navbar-toggler"}  data-toggle="dropdown" role={"button"} aria-haspopup="true" aria-expanded="false">Add Object</a>
//                         <div className="dropdown-menu">
//                             <a className={"dropdown-item"} id={'transition'}
//                                title={'Aggiungi una transizione'}
//                                onClick={() => (createTransition(props))}
//                             >Transition</a>
//                         </div>
//                     </li>
//                 </ul>
//
//             </nav>
//         </div>
//     );
// }

/* Header
<button type="button" className={"btn btn-primary"} onClick={() => props.switchToPlayMode()}>PLAY</button>
<InputSceneForm {...props} />
<button type="button" className={"btn btn-primary"} id={'transition'}
        title={'Aggiungi una transizione'}
        onClick={() => (createTransition(props))}
>+</button> */

/* <div className={'topbar'}>
                 <nav className="navbar  navbar-light">
                     <a className="navbar-brand">PacPac</a>
                     <a className={"nav-item navbar-toggler"} onClick={() => props.switchToPlayMode()}>PLAY</a>
                     <InputSceneForm {...props} />
                     <a className={"nav-item navbar-toggler"} id={'remove_scene'}
                        title={'Rimuovi una scena'}
                        onClick={() => {
                            if(props.currentScene != null){
                                SceneAPI.deleteScene(props.currentScene);
                                props.updateCurrentScene(null);

                            }
                            else{
                                alert("Devi aver già selezionato la scena da rimuovere.")
                            }
                        }}
                     >RemoveScene</a>
                     <a className={"nav-item navbar-toggler"} id={'transition'}
                             title={'Aggiungi una transizione'}
                             onClick={() => (createTransition(props))}
                     >+</a>

                 </nav>
             </div>
       */