import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import interface_utils from "./interface_utils";
import MediaAPI from "../../utils/MediaAPI";

let THREE = require('three');

function RightBar(props){
    return(
        <div className={'rightbar'}>
            <div id={'rbContainer'}>
                {view(props)}
            </div>
        </div>
    );
}

function view(props){
    return(
        <div id={'rightbarView'}>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active"
                       id="nav-scene-tab" data-toggle="tab" href="#nav-scene" role="tab" aria-controls="nav-scene"
                       aria-selected="true" >Scena</a>
                    <a className="nav-item nav-link" id="nav-interactives-tab" data-toggle="tab" href="#nav-interactives" role="tab"
                       aria-controls="nav-interactives" aria-selected="false">Oggetti</a>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active flex-container" id="nav-scene" role="tabpanel" aria-labelledby="nav-scene-tab">
                    {sceneView(props)}
                </div>
                <div className="tab-pane fade" id="nav-interactives" role="tabpanel" aria-labelledby="nav-interactives-tab">
                    {optionsView(props)}
                </div>
            </div>
        </div>);
}

/**
 * Generates current scene options
 * @param props
 * @returns {*}
 */
function sceneView(props){
    if(props.currentScene){
        let scene = props.scenes.get(props.currentScene);
        return(
            <div className={'currentObjectOptions'}>
                <div>
                    <div className={"buttonGroup"}>
                        <button
                            title={"Elimina la scena corrente"}
                            className={"action-buttons-container"}
                            onClick={() => {
                                SceneAPI.deleteScene(scene);
                            }}
                        >
                            <img className={"action-buttons scene-buttons-img"} src={"icons8-waste-50.png"}/>
                        </button>
                    </div>
                </div>
                <label>Nome:</label>
                <div id={"sceneName"}
                     className={"propertyForm"}
                     contentEditable={true}
                >
                    {scene.name}
                </div>
            </div>
        );
    } else {
        return(
            <div>Nessuna scena selezionata</div>
        );
    }
}

/**
 * Generates currently selected object's options
 * If no objects is selected, generates objects list
 * @param props
 * @returns {*}
 */
function optionsView(props){
    if(props.currentObject){
        return generateProperties(props);
    } else {
        return showObjects(props.interactiveObjects,props);
    }
}

/**
 * Generates list of objects associated to the scene or to the entire project, depending on user's choice
 * @param interactiveObjects
 * @param props
 * @returns {*}
 */
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


/**
 * Generates options of currently selected object
 * @param props
 * @returns {*}
 */
function generateProperties(props){

    let currentObject = props.interactiveObjects.get(props.currentObject);

    return(
        <div className={'currentObjectOptions'}>
            {objectButtons(props)}
            <label>Proprietà</label>
            <label>Tipologia: {currentObject.type}</label>
            <label>Nome:</label>
            <div id={"objectName"}
                 className={"propertyForm"}
                 contentEditable={true}
                 onBlur={()=> interface_utils.setPropertyFromId(currentObject,'name',"objectName", props)}
            >
                {currentObject.name}
            </div>
            {generateSpecificProperties(currentObject, props)}
            <div id={'uploadMedia'}>
                <label htmlFor={"media"}>Media</label>
                <input type="file"
                       name="media"
                       id="mediaInput"
                       onChange={() => {
                           let file = document.getElementById("mediaInput").files[0];
                           MediaAPI.uploadMedia(currentObject, file, 'media', props);
                       }}
                />
            </div>
            <div id={'uploadMask'}>
                <label htmlFor={"mask"}>Maschera</label>
                <input type="file"
                       name="mask"
                       id="maskInput"
                       onChange={() => {
                           let file = document.getElementById("maskInput").files[0]
                           MediaAPI.uploadMedia(currentObject, file, 'mask', props);
                       }}
                />
            </div>
            <label>Geometry</label>
            <button
                className={"propertyForm geometryBtn"}
                onClick={() => props.switchToGeometryMode() }
            >
                Edit Geometry
            </button>
        </div>
    );
}

/**
 * Generate options according to the object type
 * @param object
 * @param props
 * @returns {*}
 */
function generateSpecificProperties(object, props){
    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            return (
                <div>
                    <label>Duration</label>
                    <div className={"durationContainer"}>
                        <div id={"transitionDuration"}
                             className={"propertyForm"}
                             contentEditable={true}
                             onBlur={()=> interface_utils.setPropertyFromId(object,'duration',"transitionDuration", props)}
                             onInput={() => interface_utils.onlyNumbers("transitionDuration")}
                        >
                            {object.properties.duration}
                        </div><span className={"measureUnit"}>ms</span>
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.SWITCH:
            if(object.properties.state === 'ON'){
                return(
                    <div>
                        <label>Default State</label>
                        <select>
                            <option selected={true}>ON</option>
                            <option>OFF</option>
                        </select>
                    </div>
                );
            } else {
                return(
                    <div>
                        <label>Default State</label>
                        <select>
                            <option>ON</option>
                            <option selected={true}>OFF</option>
                        </select>
                    </div>
                );
            }
        default:
            return(<div>Error!</div>);

    }
}


/**
 * Generates buttons for currently selected object options
 * @param props
 * @returns {*}
 */
function objectButtons(props){
    let currentScene = props.scenes.get(props.currentScene);
    let currentObject = props.interactiveObjects.get(props.currentObject);
    return(
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
                    InteractiveObjectAPI.saveObject(currentScene, currentObject);
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
                    InteractiveObjectAPI.removeObject(currentScene, currentObject);
                    props.updateCurrentObject(null);
                }
                }
            >
                <img  className={"action-buttons"} src={"icons8-waste-50.png"} alt={'Cancella'}/>
            </button>
        </div>
    );
}


/**
 * Generate objects list according to the chosen filter ('scene','all', etc)
 * @param props
 * @returns {*}
 */
function generateObjectsList(props) {

    // filter "all" or no scene selected
    if(props.currentScene == null || props.objectsFilter === 'all'){

        // no objects
        if(props.interactiveObjects.size === 0)
            return (<div>Non ci sono oggetti</div>)

        // objects mapping
        return ([...props.interactiveObjects.values()].map( obj => {
            return (
                <div key={obj.name}
                     className={'objectsList-element'}
                     onClick={()=> Actions.updateCurrentObject(obj.uuid)}>
                     {obj.name}
                 </div>
            );
        }));
    }

    // filter "scene"
    if (props.objectsFilter === 'scene'){

        let objects = props.scenes.get(props.currentScene).objects;
        let allObjects = objects.transitions.concat(objects.switches);

        // no objects in scene
        if (allObjects.length === 0 ){
            return (<div>Non ci sono oggetti associati a questa scena</div>)
        }

        // scene objects mapping
        return (allObjects.map(obj_uuid => {
            let obj = props.interactiveObjects.get(obj_uuid);
            return (
                <div key={obj.uuid}
                     className={'objectsList-element'}
                     onClick={()=> Actions.updateCurrentObject(obj.uuid)}>
                    {obj.name}
                </div>
            );
            }
        ));

    }
}

/**
 *
 * @param object
 * @param type
 * @param name
 * @param props
 */
function loadFile(object, type, name, props){

}

/*
function checkGeometryMode(props) {

    let target = document.getElementById('target').value;

    if (target !== '---') {
        props.switchToGeometryMode()
    }
    else {
        alert("Nessun target selezionato")
    }
}
*/

export default RightBar;