import React from 'react';
import InputSceneForm from './InputSceneForm';
import Transition from "../../interactives/Transition";
import Actions from "../../actions/Actions";

function TopBar(props){
    return (
        <div className={'topbar'}>
            Header
            <button onClick={() => props.switchToPlayMode()}>PLAY</button>
            <InputSceneForm {...props} />
            <button id={'transition'}
                    className={'createObjectButton'}
                    title={'Aggiungi una transizione'}
                    onClick={() => Actions.addNewObject(new Transition())}
            > + </button>
        </div>

    );
}

export default TopBar;