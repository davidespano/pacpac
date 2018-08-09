import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import InteractiveObject from "../../interactives/InteractiveObject";

function RightBar(props){

    //console.log(props.currentObject);
    //console.log(props.interactiveObjects);
    
    return(
        <div className={'rightbar'}>
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
            return generateTransitionOptions(props.currentObject.object, props);
        default:
            return showObjects(props.interactiveObjects,props);
    }
}

function showObjects(interactiveObjects,props) {

    return (
        <div id={'objectsList'} className={'currentObjectOptions'}>
            <a>Oggetti</a>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <button className={"btn"} onClick={() => props.filterObjectFunction('all')}> All</button>
                <button className={"btn"}  onClick={() => props.filterObjectFunction('scene')}> Scene Object </button>
            </div>
            {generateObjectsList(props)}
        </div>
    );
}

function generateTransitionOptions(object, props){
    return(
        <div className={'currentObjectOptions'}>
            <a>Proprietà</a>
            <button onClick={()=> props.selectAllObjects()} className={"btn"}>Show Objects</button>
            <label>Target:</label>
            <select id={"target"} className={"custom-select"} onChange={() => setProperty(object, 'media' , "target", props)}>
                <option key={"void_target"}>--</option>
                {generateTargetOptions(props)}
            </select>
                <label>Nome:</label>
                <div id={"transitionName"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> setProperty(object,'name',"transitionName", props)}
                >
                    {object.name}
                </div>

                <label>Duration</label>
                <div id={"transitionDuration"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> setProperty(object,'duration',"transitionDuration", props)}
                     onInput={() => onlyNumbers("transitionDuration")}
                >
                    {object.duration}
                </div>
                <label>Geometry</label>
                <button
                    className={"propertyForm geometryBtn"}
                    onClick={() => props.switchToGeometryMode()}
                >
                    Edit Geometry
                </button>
            </div>
    );
}

//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let text = document.getElementById(id);
    text.textContent = text.textContent.replace(/[^0-9.]/g, '');
    text.textContent = text.textContent.replace(/(\..*)\./g, '$1');
}

function setProperty(object, property, id, props){
    let value = document.getElementById(id).textContent;
    switch (property) {

        case "rotationX":
            object.setRotationX(value);
            break;
        case "rotationY":
            object.setRotationY(value);
            break;
        case "rotationZ":
            object.setRotationZ(value);
            break;
        case "name":
            object.setName(value);
            object.rules.forEach(rule => {props.updateDatalist(rule.uuid,value)});
            break;
        case "media":
            let target = document.getElementById(id);
            object[property] = target.options[target.selectedIndex].text;
            object.rules.forEach(rule => {
                rule.action.forEach(action => action.target = object[property])
            } );

            break;
        default:
            object[property] = value;
    }
    props.updateCurrentObject(object,props.currentObject.type);


}

function generateObjectsList(props) {
    //console.log(props.objectsFilter);

    if (props.currentScene == null || props.objectsFilter === 'all'){
        if (props.interactiveObjects.size === 0 ){
            return (<div>Non ci sono oggetti</div>)
        }

        return ([...props.interactiveObjects.values()].map( value => {
                //console.log(value);
                return (<div key={value.name} className={'objectsList-element'} onClick={()=> Actions.addNewTransition(props.currentScene,value)}> {value.name} </div>);
            }
        ));
    }

    else if (props.objectsFilter ==='scene'){

        if (props.currentScene.transitions.length === 0 ){
            return (<div>Non ci sono oggetti associati a questa scena</div>)
        }

        return ([...props.currentScene.transitions.values()].map( value => {
                //console.log(value);
                return (<div key={value.name} className={'objectsList-element'} onClick={()=> Actions.addNewTransition(props.currentScene,value)}> {value.name} </div>);
            }
        ));
    }

}

function generateTargetOptions(props) {
    console.log(props.currentObject.object.rules);
    return ([...props.scenes.values()].map(child => {
        if(child.name != props.currentScene.name) {
            if (child.name === props.currentObject.object.media) {
                return (<option key={child.name + "target"} selected={"selected"}>{child.name}</option>)
            }
            else {
                return (<option key={child.name + "target"}>{child.name}</option>)
            }
        }

    }));

}

export default RightBar;

/*<label>Rotation</label>
            <div className={"rotationInput"}>
                <div
                    id={"rotationX"}
                    className={"propertyForm"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationX',"rotationX", props)}
                    onInput={() => onlyNumbers("rotationX")}
                >
                    {object.rotationX}
                </div>
            </div>
            <div  className={"rotationInput"}>
                <div
                    id={"rotationY"}
                    className={"propertyForm"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationY',"rotationY", props)}
                    onInput={() => onlyNumbers("rotationY")}
                >
                    {object.rotationY}
                </div>
            </div>
            <div   className={"rotationInput"}>
                <div
                    id={"rotationZ"}
                    className={"propertyForm"}
                    contentEditable={true}
                    onBlur={()=> setProperty(object,'rotationZ',"rotationZ", props)}
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
                    onBlur={()=> setProperty(object,'theta',"transitionTheta", props)}
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
                    onBlur={() => setProperty(object,'height',"transitionHeight", props)}
                    onInput={() => onlyNumbers("transitionHeight")}
                >
                    {object.height}
                </div>*/