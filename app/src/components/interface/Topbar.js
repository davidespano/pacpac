import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";
import MyScene from "../../scene/MyScene";

function TopBar(props){
    return (
         <div className={'topbar'}>
                 <nav className="navbar  navbar-light">
                     <a className="navbar-brand">PacPac</a>
                     <a className={"nav-item navbar-toggler"} onClick={() => props.switchToPlayMode()}>PLAY</a>
                     <InputSceneForm {...props} />
                     <a className={"nav-item navbar-toggler"} id={'transition'}
                             title={'Aggiungi una transizione'}
                             onClick={() => (createTransition(props))}
                     >+</a>
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