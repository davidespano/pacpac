import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";
import MyScene from "../../scene/MyScene";
import SceneAPI from "../../utils/SceneAPI";

function TopBar(props){
    return (
        <div className={'topbar'}>
            <nav className="navbar  navbar-light">
                <a className="navbar-brand">PacPac</a>
                <InputSceneForm {...props} />
                <ul className={"nav"}>
                    <li className="nav-item dropdown">
                        <a className={"nav-item navbar-toggler"} onClick={() => props.switchToPlayMode()}>PLAY</a>
                    </li>
                <li className="nav-item dropdown">
                <a className={"dropdown-toggle navbar-toggler"}  data-toggle="dropdown" role={"button"} aria-haspopup="true" aria-expanded="false">Edit Scene</a>
                <div className="dropdown-menu">
                    <a className="dropdown-item" data-toggle="modal" data-target="#exampleModal">
                        AddScene
                    </a>
                    <a className={"dropdown-item"} id={'remove_scene'}
                       title={'Rimuovi una scena'}
                       onClick={() => {
                           if(props.currentScene != null){
                               SceneAPI.deleteScene(props.currentScene);
                               props.updateCurrentScene(null);
                               props.updateCurrentObject(null);
                           }
                           else{
                               alert("Devi aver già selezionato la scena da rimuovere.")
                           }
                       }}
                    >RemoveScene</a>
                    <a className={"dropdown-item"} id={'remove_scene'}
                       title={'Rimuovi una scena'}
                       onClick={() => {
                               props.removeAllScene();
                               props.updateCurrentScene(null);
                               console.log(props.scenes);
                               props.updateCurrentObject(null);
                       }}
                    >RemoveALL</a>
                </div>
                </li>
                </ul>
                <ul className={"nav"}>
                    <li className="nav-item dropdown">
                        <a className={"dropdown-toggle navbar-toggler"}  data-toggle="dropdown" role={"button"} aria-haspopup="true" aria-expanded="false">Add Object</a>
                        <div className="dropdown-menu">
                            <a className={"dropdown-item"} id={'transition'}
                               title={'Aggiungi una transizione'}
                               onClick={() => (createTransition(props))}
                            >transition</a>
                        </div>
                    </li>
                </ul>

            </nav>
        </div>
    );
}

function createTransition(props) {
    if(props.currentScene != null){
        let tr = new Transition();
        let name = props.currentScene.name + '_tr' + (props.currentScene.transitions.length + 1);
        tr.setName(name);
        rulesToDatalist(tr,props);
        let newScene = new MyScene(
            props.currentScene.img,
            props.currentScene.tagName,
            props.currentScene.tagColor,
            props.currentScene.transitions,
        );

        newScene.addNewTransitionToScene(tr);
        props.addNewTransition(newScene, tr);
    } else {
        alert("Nessuna scena selezionata!");
    }
}

function rulesToDatalist(object,props){

    object.rules.forEach((rule) => {props.updateDatalist(rule.uuid, object.name)} )
}

export default TopBar;
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