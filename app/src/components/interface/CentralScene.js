import React from 'react';

function CentralScene(props){

    console.log(props.currentScene);

    if(props.currentScene !== null){
        return(
            <div className={'scene'}>
                <img id={'scene'}
                     src={"http://localhost:3000/media/" + props.currentScene.img}
                     alt={props.currentScene.name}
                     onClick={(event) => {
                         let p = getCoordinates(event);
                         props.clickScene(p.x, p.y);
                     }}
                />
            </div>
        );
    }

    return(
        <div className={'scene'}>
            <p>Seleziona una scena per iniziare</p>
        </div>
    );
}

function getCoordinates(event){

    var img = document.getElementById('scene');

    return {
        x: event.pageX - img.offsetLeft,
        y: event.pageY - img.offsetTop,
    };
}

export default CentralScene;

//props.clickScene(getCoordinates(event).x, getCoordinates(event).y)