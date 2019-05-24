import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import interface_utils from "./interface_utils";
import scene_utils from "../../scene/scene_utils";
import TagDropdown from "./TagDropdown";
import FileSelectionBtn from "./FileSelectionBtn";
import Values from "../../interactives/rules/Values";
import Dropdown from "./Dropdown";
import stores_utils from "../../data/stores_utils";
import Orders from "../../data/Orders";

let THREE = require('three');

function RightBar(props){

    return(
        <div className={'rightbar'}>
        	{view(props)}
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
    return props.editor.rightbarSelection === 'scene' ? sceneView(props) : optionsView(props);
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
                    <div className={"buttonGroup buttonGroup-bar"}>
                        <button
                            title={"Elimina la scena corrente"}
                            className={"action-buttons-container"}
                            onClick={() => {
                                checkAndRemoveScene(props, scene);
                            }}
                        >
                            <img className={"action-buttons scene-buttons-img"} src={"icons/icons8-waste-50.png"}/>
                        </button>
                    </div>
                </div>
                <label className={'rightbar-titles'}>Nome e tipologia</label>
                <div className={'rightbar-grid'}>
                    <div id={"sceneName"}
                         className={"propertyForm rightbar-box"}
                         contentEditable={true}
                         onBlur={() => {
                             let value = document.getElementById('sceneName').textContent;
                             scene_utils.setProperty(scene, 'name', value, props);
                         }}
                    >
                        {scene.name}
                    </div>
                    <div>
                        <Dropdown props={props} component={'scene-type'} defaultValue={scene.type}/>
                    </div>
                </div>
                <label className={'rightbar-titles'}>Etichetta</label>
                <div className={'rightbar-grid'}>
                    <TagDropdown {...properties}/>
                    <button
                        title={"Gestisci etichette"}
                        className={"select-file-btn btn"}
                        data-toggle="modal"
                        data-target="#add-tag-modal"
                    >
                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-tags-white-50.png"}/>
                    </button>
                </div>
                <label htmlFor={'select-file-scene'} className={'rightbar-titles'}>File</label>
                <div className={'rightbar-grid'}>
                    <div id={'select-file-scene'}>
                        <p className={'file-selected-name propertyForm'}>{scene.img}</p>
                    </div>
                    <FileSelectionBtn {...properties} />
                </div>
                <label className={'rightbar-titles'}>Audio spaziali</label>
                {spatialAudioList(props, scene)}
            </div>
        );
    } else {
        return(
            <div>Nessuna scena selezionata</div>
        );
    }
}


function spatialAudioList(props, scene){
    let audioRendering;
    let audios = scene.get('audios').map(a => props.audios.get(a)).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));

    if(scene.audios.length > 0) {
        audioRendering = audios.map(audio => {
            return (
                <p className={'audio-list-element ' + checkSelection(props, audio.uuid)}
                   key={'audio-list-element-' + audio.uuid}
                   onClick={() => interface_utils.audioSelection(props, audio)}>
                    {audio.name}
                </p>
            );
        });
    } else {
        audioRendering = <p className={'no-audio'}>Nessun audio spaziale</p>
    }


    return (
        <React.Fragment>
            <div className={'audio-list-box-btns'}>
                <button
                    title={"Gestisci audio"}
                    className={"select-file-btn btn"}
                    data-toggle="modal"
                    data-target="#manage-audio-modal"
                >
                    <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-white-audio-50.png"}/>
                </button>
                <button
                    title={"Modifica audio"}
                    className={"action-buttons-container"}
                    data-toggle="modal"
                    data-target="#audio-form-modal"
                    disabled={props.editor.selectedAudioToEdit == null}
                >
                    <img className={"action-buttons"} src={"icons/icons8-pencil-50.png"} alt={'Modifica'}/>
                </button>
                <button
                    title={"Cancella audio"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        let audio = props.audios.get(props.editor.selectedAudioToEdit);
                        props.removeAudio(audio);
                    }}
                    disabled={props.editor.selectedAudioToEdit == null}
                >
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Modifica'}/>
                </button>
            </div>
            <div className={'audio-list-box'}>
                {audioRendering}
            </div>
        </React.Fragment>
    );
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
            <div className={"buttonGroup buttonGroup-bar"}>
                <input type={'text'} id={'objects-filter-text'} className={'bar-filters'} placeholder={'Filtra...'}
                       onChange={() => {
                           let filter = document.getElementById('objects-filter-text').value;
                           props.updateObjectNameFilter(filter);
                       }}/>
                <div>
                    <button
                        title={"Filtra per scena corrente"}
                        className={"action-buttons-container " + checkFilters(props, 'scene')}
                        onClick={() => props.updateObjectTypeFilter('scene')}
                    >
                        <img className={"action-buttons"} src={"icons/icons8-image-100.png"} alt={'Filtra per scena corrente'}/>
                    </button>
                    <button
                        title={"Tutti gli oggetti"}
                        className={"action-buttons-container " + checkFilters(props, 'all')}
                        onClick={()=> props.updateObjectTypeFilter('all')}
                    >
                        <img className={"action-buttons"} src={"icons/icons8-gallery-50.png"} alt={'Tutti gli oggetti'}/>
                    </button>
                </div>
            </div>
            {generateObjectsList(props)}
        </div>
    );
}


function checkFilters(props, filter){
    return props.editor.objectsTypeFilter === filter ? 'selected-filter' : '';
}

function checkSelection(props, uuid){
    return props.editor.selectedAudioToEdit === uuid ? 'selected-audio' : '';
}


/**
 * Generates options of currently selected object
 * @param props
 * @returns {*}
 */
function generateProperties(props){

    let currentObject = props.interactiveObjects.get(props.currentObject);
    let type = objectTypeToString(currentObject.type);

    return(
        <div className={'currentOptions'}>
            {objectButtons(props)}
            <div className={'figure-grid'}>
                <img className={'rightbar-img'} src={findImg(currentObject)} alt={type} title={type}/>
                <p>{type}</p>
            </div>
            <label className={'rightbar-titles'}>Nome</label>
            <div className={'rightbar-grid'}>
                <div id={"objectName"}
                     className={"propertyForm"}
                     contentEditable={true}
                     onBlur={()=> interface_utils.setPropertyFromId(currentObject,'name',"objectName", props)}
                >
                    {currentObject.name}
                </div>
            </div>
            <label className={'rightbar-titles'}>Opzioni</label>
            <div className={'options-grid'}>
                <label className={'options-labels'}>Visibilità:</label>
                <Dropdown props={props} component={'visibility'} defaultValue={currentObject.visible}/>
            </div>
            {generateSpecificProperties(currentObject, props)}
            <div className={'options-grid'}>
                <label className={'options-labels'}>Media:</label>
                <button id={'edit-media-btn'}
                        className={'btn select-file-btn rightbar-btn'}
                        data-toggle="modal"
                        data-target="#edit-media-modal"
                >
                    Modifica media
                </button>
                <label className={'options-labels'}>Geometria:</label>
                <button
                    className={"btn select-file-btn rightbar-btn"}
                    onClick={() => props.switchToGeometryMode() }
                >
                    Modifica geometria
                </button>
            </div>
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
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Durata:</label>
                    <div className={'flex'}>
                        <div id={"transitionDuration"}
                             className={"propertyForm-right"}
                             contentEditable={true}
                             onBlur={()=> interface_utils.setPropertyFromId(object,'duration',"transitionDuration", props)}
                             onInput={() => interface_utils.onlyNumbers("transitionDuration")}
                        >
                            {object.properties.duration}
                        </div>
                        <span className={'measure-units'}>ms</span>
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.SWITCH:
            return(
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Stato iniziale:</label>
                    <Dropdown props={props} component={'on-off'} defaultValue={object.properties.state}/>
                </div>
            );
        case InteractiveObjectsTypes.KEY:
            return (
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Stato iniziale:</label>
                    <Dropdown props={props} component={'collected-not'} defaultValue={object.properties.state}/>
                </div>
            );
        case InteractiveObjectsTypes.LOCK:
            return (
                <div>
                   {/* <select id={'keyDefaultState'}
                            defaultValue={object.properties.key_uuid}
                            onChange={() => {
                                let e = document.getElementById('keyDefaultState');
                                let value = e.options[e.selectedIndex].value;
                                interface_utils.setPropertyFromValue(object, 'key_uuid', value, props);
                            }}
                    >
                        {generateKeyList(props, object)}
                    </select>*/}
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
                    let answer = window.confirm("Vuoi cancellare l'oggetto " + currentObject.name + "?");
                    if(answer){
                        InteractiveObjectAPI.removeObject(scene, currentObject);
                        props.updateCurrentObject(null);
                    }}
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

    // filter "all" or no scene selected
    if(props.currentScene == null || props.editor.objectsTypeFilter === 'all'){

        // no objects
        if(props.interactiveObjects.size === 0)
            return (<div>Non ci sono oggetti</div>)

        // objects mapping
        return ([...props.interactiveObjects.values()].filter(obj =>
            obj.name.includes(props.editor.objectsNameFilter)).map( obj => {
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
    if (props.editor.objectsTypeFilter === 'scene'){

        let scene = props.scenes.get(props.currentScene);
        //let allObjects = objects.transitions.concat(objects.switches).concat(objects.collectable_keys);
        let allObjects = Object.values(scene.objects).flat();
        // no objects in scene
        if (allObjects.length === 0 ){
            return (<div>Non ci sono oggetti associati a questa scena</div>)
        }


        // scene objects mapping
        return (allObjects.map(obj_uuid => {
            let obj = props.interactiveObjects.get(obj_uuid);
            if(obj.name.includes(props.editor.objectsNameFilter)){
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
                                 let answer = window.confirm("Vuoi cancellare l'oggetto " + obj.name + "?");
                                 if (answer) {
                                     InteractiveObjectAPI.removeObject(scene, obj);
                                     props.updateCurrentObject(null);
                                 }
                             }}
                        />
                    </div>
                );
            }
        }));
    }
}

function checkAndRemoveScene(props, scene){
    let answer = window.confirm('Vuoi rimuovere la scena? Verranno rimossi tutti gli oggetti, regole e audio ad essa collegati.');
    if(answer){
        props.removeScene(scene);
    }
}

function objectTypeToString(objectType) {
    switch (objectType) {
        case InteractiveObjectsTypes.BUTTON:
            return "Pulsante";
        case InteractiveObjectsTypes.COUNTER:
            return "Contatore";
        case InteractiveObjectsTypes.CUMULABLE:
            return "Oggetto";
        case InteractiveObjectsTypes.LOCK:
            return "Serratura";
        case InteractiveObjectsTypes.SELECTOR:
            return "Selettore";
        case InteractiveObjectsTypes.SWITCH:
            return "Interruttore";
        case InteractiveObjectsTypes.TIMER:
            return "Timer";
        case InteractiveObjectsTypes.KEY:
            return "Chiave";
        case InteractiveObjectsTypes.TRANSITION:
            return "Transizione";
        default:
            return "Sconosciuto";
    }
}

function findImg(object) {
    switch (object.type) {
        case InteractiveObjectsTypes.LOCK:
            return "icons/icons8-lock-100.png";
        case InteractiveObjectsTypes.SWITCH:
            return "icons/icons8-toggle-on-filled-100.png";
        case InteractiveObjectsTypes.KEY:
            return "icons/icons8-key-100.png";
        case InteractiveObjectsTypes.TRANSITION:
            return "icons/icons8-one-way-transition-100.png";
        default:
            return "icons/icons8-plus-math-filled-100.png";
    }

}

export default RightBar;