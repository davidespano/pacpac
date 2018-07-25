import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";

function RightBar(props){

    //console.log(props.currentObject);
    //console.log(props.interactiveObjects);
    
    return(
        <div className={'rightbar'}>
            <a>Proprietà</a>
            <button onClick={()=> props.selectAllObjects()} className={"btn"}>ObjectList</button>
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
            <div id={'objectsList'}>
                {interactiveObjects.map( value => {
                    //console.log(value);
                    return (<div key={value.name} className={'objectsList-element'}>{value.name}</div>);
                })}
            </div>
        );
    } else {
        //console.log('????');
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
                <label>Nome:</label>
                <div id={"transitionName"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> setProperty(object,'name',"transitionName")}
                >
                    {object.name}
                </div>

                <label>Duration</label>
                <div id={"transitionDuration"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> setProperty(object,'duration',"transitionDuration")}
                     onInput={() => onlyNumbers("transitionDuration")}
                >
                    {object.duration}
                </div>
            <label>Rotation</label>
            <div className={"propertyForm"}>
                <div
                    id={"rotationX"}
                    className={"rotationInput"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationX',"rotationX")}
                    onInput={() => onlyNumbers("rotationX")}
                >
                    {object.rotationX}
                </div>

                <div
                    id={"rotationY"}
                    className={"rotationInput"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationY',"rotationY")}
                    onInput={() => onlyNumbers("rotationY")}
                >
                    {object.rotationY}
                </div>
                <div
                    id={"rotationZ"}
                    className={"rotationInput"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationZ',"rotationZ")}
                    onInput={() => onlyNumbers("rotationZ")}
                >
                    {object.rotationZ}
                </div>
            </div>
            <div>
                <label>Theta</label>
                <div
                    id={"transitionTheta"}
                    className={"propertyForm"}
                    defaultValue={object.theta}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'theta',"transitionTheta")}
                    onInput={() => onlyNumbers("transitionTheta")}
                >
                    {object.theta}
                </div>
            </div>
            <div>
                <label>Height</label>
                <div
                    id={"transitionHeight"}
                    className={"propertyForm"}
                    defaultValue={object.height}
                    contentEditable={true}
                    onBlur={() => setProperty(object,'height',"transitionHeight")}
                    onInput={() => onlyNumbers("transitionHeight")}
                >
                    {object.height}
                </div>
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

function setProperty(object, property, id){
    let prova = document.getElementById(id).textContent;
    object[property]=prova;
    

}

export default RightBar;

