import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";

let THREE = require('three');

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
            <div className={"buttonGroup"}>
                <button
                    title={"Cerca un oggetto"}
                    className={"action-buttons-container"}
                >
                    <img className={"action-buttons"} src={"icons8-search-filled-50.png"} alt={'Cerca un oggetto'}/>
                </button>
                <button
                    title={"Filtra per scena corrente"}
                    className={"action-buttons-container"}
                    onClick={() => props.filterObjectFunction('scene')}
                >
                    <img className={"action-buttons"} src={"icons8-image-100.png"} alt={'Filtra per scena corrente'}/>
                </button>
                <button
                    title={"Tutti gli oggetti"}
                    className={"action-buttons-container"}
                    onClick={()=> props.filterObjectFunction('all')}
                >
                    <img className={"action-buttons"} src={"icons8-gallery-50.png"} alt={'Tutti gli oggetti'}/>
                </button>

            </div>
            {generateObjectsList(props)}
        </div>
    );
}

function generateTransitionOptions(object, props){

    return(
        <div className={'currentObjectOptions'}>
            <div className={"buttonGroup"}>
                <button
                    title={"Torna all'elenco degli oggetti"}
                    className={"action-buttons-container"}
                    onClick={()=> props.selectAllObjects()}
                >
                    <img  className={"action-buttons"} src={"icons8-go-back-50.png"} alt={'Torna all\'elenco degli oggetti'}/>
                </button>
                <button
                    title={"Salva"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        InteractiveObjectAPI.saveTransitions(props.currentScene, props.currentObject.object);
                        alert("Hai salvato!")
                    }
                    }
                >
                    <img className={"action-buttons"} src={"icons8-save-as-50.png"} alt={'Salva'}/>
                </button>
                <button
                    title={"Cancella"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        InteractiveObjectAPI.removeTransition(props.currentScene, props.currentObject.object);
                        props.updateCurrentObject(null);
                    }
                    }
                >
                    <img  className={"action-buttons"} src={"icons8-waste-50.png"} alt={'Cancella'}/>
                </button>
            </div>
            <label>Proprietà</label>
            <label>Tipologia: Transizione</label>
            <label>Nome:</label>
            <div id={"transitionName"}
                 className={"propertyForm"}
                 contentEditable={true}
                 onBlur={()=> setProperty(object,'name',"transitionName", props)}
            >
                {object.name}
            </div>
            <label>Target:</label>
            <select id={"target"} className={"custom-select"} onChange={() => setProperty(object, 'target' , "target", props)}>
                <option key={"void_target"}>---</option>
                {generateTargetOptions(props)}
            </select>
            <label>Duration</label>
            <div className={"durationContainer"}>
                <div id={"transitionDuration"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> setProperty(object,'duration',"transitionDuration", props)}
                     onInput={() => onlyNumbers("transitionDuration")}
                >
                    {object.duration}
                </div><span className={"measureUnit"}>ms</span>
            </div>
            <label>Geometry</label>
            <button
                className={"propertyForm geometryBtn"}
                onClick={() => checkGeometryMode(props) }
            >
                Edit Geometry
            </button>
        </div>
    );
}

function setProperty(object, property, id, props){
    let value = document.getElementById(id).textContent;
    switch (property) {
        case "name":
            object.setName(value);
            object.rules.forEach(rule => {props.updateDatalist(rule.uuid,value)});
            break;
        case "target":
            let target = document.getElementById(id);
            object.rules.forEach(rule => {
                rule.actions.forEach(action => action.target = target.options[target.selectedIndex].text)
            } );

            console.log('setting target');
            console.log(object);
            console.log(props.currentObject);
            break;
        default:
            object[property] = value;
    }
    props.updateCurrentObject(object,props.currentObject.type);
    InteractiveObjectAPI.saveTransitions(props.currentScene, props.currentObject.object);
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
    } else if (props.objectsFilter === 'scene'){

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
        if(child.name !== props.currentScene.name) {
            if (child.img === props.currentObject.object.media) {
                return (<option key={child.img + "target"} selected={"selected"}>{child.img}</option>)
            }
            else {
                return (<option key={child.img + "target"}>{child.img}</option>)
            }
        }
    }));

}

function checkGeometryMode(props) {

    let target = document.getElementById('target').value;

    if (target !== '--') {
        props.switchToGeometryMode()
    }
    else {
        alert("Nessun target selezionato")
    }
}

//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let text = document.getElementById(id);
    text.textContent = text.textContent.replace(/[^0-9.]/g, '');
    text.textContent = text.textContent.replace(/(\..*)\./g, '$1');
}

// function geometryData (props) {
//    // let c=document.getElementById("myCanvas");
//
//     let geometry = [];
//
//     geometry = [...props.currentObject.object.vertices].map(function (vertex) {
//         let points = vertex.split(' ').map(function(x){return parseFloat(x);});
//         return new THREE.Vector3(points[0], points[1], points[2]);
//     });
//
//     console.log(geometry);
//
//
// }

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

/*FILTRO PER TUTTI GLI OGGETTI
 <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <button className={"btn"} onClick={() => props.filterObjectFunction('all') }> All</button>
       <button className={"btn"} onClick={() => props.filterObjectFunction('all') }> All</button>
       <div>
 */