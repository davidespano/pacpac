import React from 'react';
import InputSceneForm from './InputSceneForm';

function TopBar(props){
    return (
        <div className={'topbar'}>
            Header
            <button onClick={() => props.switchToPlayMode()}>PLAY</button>
            <InputSceneForm {...props} />
        </div>

    );
}

export default TopBar;