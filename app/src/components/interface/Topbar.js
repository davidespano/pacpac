import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";

function TopBar(props){
    return (
         <div className={'topbar'}>
            Header
            <button type="button" class="btn btn-primary" onClick={() => props.switchToPlayMode()}>PLAY</button>
            <InputSceneForm {...props} />
            <button type="button" class="btn btn-primary" id={'transition'}
                    title={'Aggiungi una transizione'}
                    onClick={() => (createTransition(props))}
            >+</button>
        </div>
    );
}

function createTransition(props) {
    let tr = new Transition();
    tr.setName(props.currentScene.name + '_tr' + (props.currentScene.transitions.length + 1));
    Actions.addNewTransition(tr);
}

export default TopBar;