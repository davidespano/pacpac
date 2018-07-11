import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";

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
    let tr = new Transition();
    tr.setName(props.currentScene.name + '_tr' + (props.currentScene.transitions.length + 1));
    Actions.addNewTransition(tr);
}

export default TopBar;
/* Header
<button type="button" className={"btn btn-primary"} onClick={() => props.switchToPlayMode()}>PLAY</button>
<InputSceneForm {...props} />
<button type="button" className={"btn btn-primary"} id={'transition'}
        title={'Aggiungi una transizione'}
        onClick={() => (createTransition(props))}
>+</button> */