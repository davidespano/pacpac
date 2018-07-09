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
                    onClick={() =>Actions.addNewTransition()}
            >+</button>
        </div>
    );
}

export default TopBar;