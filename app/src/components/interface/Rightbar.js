import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import interface_utils from "./interface_utils";
import scene_utils from "../../scene/scene_utils";
import TagDropdown from "./TagDropdown";

let THREE = require('three');

function RightBar(props){


    console.log(props.mentions);

    return(
        <div className={'rightbar'}>
            <div id={'rbContainer'}>
                {view(props)}
            </div>
        </div>
    );
}


/**
 * Generates upper buttons for scene or objects selection, and calls upon another function to generate content
 * @param props
 * @returns {*}
 */
function view(props){
    return(
        <div id={'rightbarView'}>
            <nav id={'nav-rightbar'}>
                <div id={'nav-tab-scene'}
                     className={'nav-tab-rightbar ' + interface_utils.checkSelection('rightbar', 'scene', props.editor)}
                     onClick={() => {
                         props.rightbarSelection('scene');
                     }}>
                    Scena
                </div>
                <div id={'nav-tab-objects'}
                     className={'nav-tab-rightbar ' + interface_utils.checkSelection('rightbar', 'objects', props.editor)}
                     onClick={() => {
                         props.rightbarSelection('objects')
                     }}>
                    Oggetti
                </div>
            </nav>
            <div className={'tab-content'}>
                {content(props)}
            </div>
        </div>
    );
}

/**
 * Generates content relative to scene or to objects according to the given selection
 * @param props
 * @returns {*}
 */
function content(props){
    if(props.editor.rightbarSelection === 'scene'){
        return (
            <div className={'currentOptions'}>
                {sceneView(props)}
            </div>
        );
    }

    if(props.editor.rightbarSelection === 'objects'){
        return (
            <div className={'currentOptions'}>
                {optionsView(props)}
            </div>
        );
    }

    return (<div>Error!</div>);
}

/**
 * Generates current scene options
 * @param props
 * @returns {*}
 */
function sceneView(props){
    
    let properties = {
        props : props,
        component : 'rightbar',
    };

    if(props.currentScene){
        let scene = props.scenes.get(props.currentScene);
        let tag = props.tags.get(scene.tag);
        return(
            <div className={'currentOptions'}>
                <div>
                    <div className={"buttonGroup"}>
                        <button
                            title={"Elimina la scena corrente"}
                            className={"action-buttons-container"}
                            onClick={() => {
                                SceneAPI.deleteScene(scene);
                            }}
                        >
                            <img className={"action-buttons scene-buttons-img"} src={"icons/icons8-waste-50.png"}/>
                        </button>
                    </div>
                </div>
                <label>Nome:</label>
                <div id={"sceneName"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={() => {
                         let value = document.getElementById('sceneName').textContent;
                         scene_utils.setProperty(scene, 'name', value, props, props.editor.scenesOrder);
                     }}
                >
                    {scene.name}
                </div>
                <label>Etichetta:</label>
                <TagDropdown {...properties}/>
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
        return showObjects(props.interactiveObjects, props);
    }
}

/**
 * Generates list of objects associated to the scene or to the entire project, depending on user's choice
 * @param interactiveObjects
 * @param props
 * @returns {*}
 */
function showObjects(interactiveObjects, props) {
    return (
        <div id={'objectsList'} className={'currentOptions'}>
            <div className={"buttonGroup"}>
                <button
                    title={"Cerca un oggetto"}
                    className={"action-buttons-container"}
                >
                    <img className={"action-buttons"} src={"icons/icons8-search-filled-50.png"} alt={'Cerca un oggetto'}/>
                </button>
                <button
                    title={"Filtra per scena corrente"}
                    className={"action-buttons-container"}
                    onClick={() => props.filterObjectFunction('scene')}
                >
                    <img className={"action-buttons"} src={"icons/icons8-image-100.png"} alt={'Filtra per scena corrente'}/>
                </button>
                <button
                    title={"Tutti gli oggetti"}
                    className={"action-buttons-container"}
                    onClick={()=> props.filterObjectFunction('all')}
                >
                    <img className={"action-buttons"} src={"icons/icons8-gallery-50.png"} alt={'Tutti gli oggetti'}/>
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
        <div className={'currentOptions'}>
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
            <label>Media</label>
            <button id={'edit-media-btn'}
                    className={'propertyForm geometryBtn'}
                    data-toggle="modal"
                    data-target="#edit-media-modal"
            >
                Edit Media
            </button>
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
            return(
                <div>
                    <label>Stato iniziale</label>
                    <select id={'switchDefaultState'}
                            defaultValue={object.properties.state}
                            onChange={() => {
                                let e = document.getElementById('switchDefaultState');
                                let value = e.options[e.selectedIndex].value;
                                interface_utils.setPropertyFromValue(object, 'state', value, props);
                    }}
                    >
                        <option value={'ON'}>ON</option>
                        <option value={'OFF'}>OFF</option>
                    </select>
                </div>
            );
        case InteractiveObjectsTypes.KEY:
            return (
                <div>
                    <label>Stato iniziale</label>
                    <input type={"checkbox"} id={'keyDefaultState'}
                            defaultValue={object.properties.state}
                            onChange={() => {
                                let e = document.getElementById('keyDefaultState');
                                let value = e.options[e.selectedIndex].value;
                                interface_utils.setPropertyFromValue(object, 'state', value, props);
                            }}
                    />
                        Collected
                </div>
            );
        case InteractiveObjectsTypes.LOCK:
            return (
                <div>
                    <select id={'keyDefaultState'}
                            defaultValue={object.properties.key_uuid}
                            onChange={() => {
                                let e = document.getElementById('keyDefaultState');
                                let value = e.options[e.selectedIndex].value;
                                interface_utils.setPropertyFromValue(object, 'key_uuid', value, props);
                            }}
                    >
                        {generateKeyList(props, object)}
                    </select>
                </div>
            );
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
    let scene = props.scenes.get(props.objectToScene.get(props.currentObject));
    let currentObject = props.interactiveObjects.get(props.currentObject);
    return(
        <div className={"buttonGroup"}>
            <button
                title={"Torna all'elenco degli oggetti"}
                className={"action-buttons-container"}
                onClick={()=> props.selectAllObjects()}
            >
                <img  className={"action-buttons"} src={"icons/icons8-go-back-50.png"} alt={'Torna all\'elenco degli oggetti'}/>
            </button>
            <button
                title={"Salva"}
                className={"action-buttons-container"}
                onClick={() => {
                    InteractiveObjectAPI.saveObject(scene, currentObject);
                    alert("Hai salvato!")
                }
                }
            >
                <img className={"action-buttons"} src={"icons/icons8-save-as-50.png"} alt={'Salva'}/>
            </button>
            <button
                title={"Cancella"}
                className={"action-buttons-container"}
                onClick={() => {
                    InteractiveObjectAPI.removeObject(scene, currentObject);
                    props.updateCurrentObject(null);
                }
                }
            >
                <img  className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Cancella'}/>
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
    //console.log(props.interactiveObjects);

    // filter "all" or no scene selected
    if(props.currentScene == null || props.editor.objectsFilter === 'all'){

        // no objects
        if(props.interactiveObjects.size === 0)
            return (<div>Non ci sono oggetti</div>)

        // objects mapping
        return ([...props.interactiveObjects.values()].map( obj => {
            return (
                <div key={obj.uuid} className={'objects-wrapper-no-buttons'}>
                    <p className={'objectsList-element'}
                         onClick={()=> Actions.updateCurrentObject(obj.uuid)}>
                        {obj.name}
                    </p>
                </div>
            );
        }));
    }

    // filter "scene"
    if (props.editor.objectsFilter === 'scene'){

        let scene = props.scenes.get(props.currentScene);
        let objects = scene.objects;
        //let allObjects = objects.transitions.concat(objects.switches).concat(objects.collectable_keys);
        let allObjects = Object.values(scene.objects).flat();
        // no objects in scene
        if (allObjects.length === 0 ){
            return (<div>Non ci sono oggetti associati a questa scena</div>)
        }

        // scene objects mapping
        return (allObjects.map(obj_uuid => {
            let obj = props.interactiveObjects.get(obj_uuid);
            return (
                <div key={obj.uuid} className={"objects-wrapper"}>
                    <p className={'objectsList-element-delete-button'}
                         onClick={()=> Actions.updateCurrentObject(obj.uuid)}>
                        {obj.name}
                    </p>
                    <img className={"action-buttons"}
                         src={"icons/icons8-waste-50.png"}
                         alt={'Cancella'}
                         onClick={() => {
                            InteractiveObjectAPI.removeObject(scene, obj);
                            props.updateCurrentObject(null);
                         }}
                    />
                </div>
            );
            }
        ));

    }
}


/**
 * Generates target options for transitions
 * @param props
 * @returns {any[]}
 */
function generateKeyList(props, obj) {
    let scene = props.scenes.get(props.objectToScene.get(obj.uuid));
    console.log(scene);
    return ([...scene.objects.collectable_keys.values()].map(key_uuid => {
        const key = props.interactiveObjects.get(key_uuid);
            return (<option key={key.uuid} value={key.uuid}>{key.name}</option>)

    }));
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