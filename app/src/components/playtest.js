import React from 'react';

function PlayTest(props){
    return (
        <div className={'playtestContainer'}>
            <button onClick={() => props.switchToEditMode()}>EDIT</button>
        </div>
    );
}

export default PlayTest;