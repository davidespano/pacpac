import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";

function RightBar(props){

    //console.log(props.currentObject);
    //console.log(props.interactiveObjects);
    
    return(
        <div className={'rightbar'}>
            <a>Proprietà</a>
            <button onClick={()=> props.selectAllObjects()}>ObjectList</button>
            <div id={'rbContainer'}>
                <div id={'rightbarView'}>
                    {optionsView(props)}
                </div>
            </div>
        </div>
    );
}

function optionsView(props){

    switch(props.currentObject.type){
        case InteractiveObjectsTypes.TRANSITION:
            return generateTransitionOptions(props.currentObject.object);
        default:
            return showObjects(props.interactiveObjects);
    }
}

function showObjects(interactiveObjects) {
    if(interactiveObjects.size > 0){
        return (
            <ul id={'objectsList'}>
                {interactiveObjects.map( value => {
                    //console.log(value);
                    return (<li>{value.name}</li>);
                })}
            </ul>
        );
    } else {
        console.log('????');
        return (
            <div id={'objectsList'}>
                Non ci sono oggetti!
            </div>
        );
    }
}

function generateTransitionOptions(object){

    console.log(object.name);

    return(
        <div className={'currentObjectOptions'}>
            <label>media che fa cose</label>
            <div>
                <label>Nome</label>
                <input
                    id={"transitionName"}
                    className={"transitionInput"}
                    type={"text"}
                    defaultValue={object.name}
                />
                <label>Duration</label>
                <input id={"transitionDuration"}
                       className={"transitionInput"}
                       defaultValue={object.duration}
                       type={"text"}
                       onInput={()=> { onlyNumbers("transitionDuration")} }
                />
            </div>
            <div>
                <label>Rotation</label>
                <input
                    id={"rotationX"}
                    className={"rotationInput"}
                    defaultValue={object.rotationX}
                    type={"text"}
                    onInput={()=> { onlyNumbers("rotationX")} }
                />
                <input
                    id={"rotationY"}
                    className={"rotationInput"}
                    defaultValue={object.rotationY}
                    type={"text"}
                    onInput={()=> { onlyNumbers("rotationY")} }
                />
                <input
                    id={"rotationZ"}
                    className={"rotationInput"}
                    defaultValue={object.rotationZ}
                    type={"text"}
                    onInput={()=> { onlyNumbers("rotationZ")} }
                />
            </div>
            <div>
                <label>Theta</label>
                <input
                    id={"transitionTheta"}
                    className={"transitionInput"}
                    defaultValue={object.theta}
                    type={"text"}
                    onInput={()=> { onlyNumbers("transitionTheta")} }
                />
            </div>
            <div>
                <label>Height</label>
                <input
                    id={"transitionHeight"}
                    className={"transitionInput"}
                    defaultValue={object.height}
                    type={"text"}
                    onInput={()=> { onlyNumbers("transitionHeight")} }
                />
            </div>
        </div>
    );
}

//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let text = document.getElementById(id);
    text.value = text.value.replace(/[^0-9.]/g, '');
    text.value = text.value.replace(/(\..*)\./g, '$1');
}


export default RightBar;

