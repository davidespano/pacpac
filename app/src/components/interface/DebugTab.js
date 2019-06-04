import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import interface_utils from "./interface_utils";
import RuleActionTypes from "../../interactives/rules/RuleActionTypes";
import Dropdown from "./Dropdown";
import EditorState from "../../data/EditorState";

let THREE = require('three');

function DebugTab(props) {

    handleClickOutside(props);

    return (
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
function view(props) {
    if (props.currentObject) {
        return (
            <div className={"debug-div"}>
                {objPropsView(props)}
            </div>
        );
    } else {
        return (
            <div className={"debug-div"}>
                {debugOptionsView(props)}
            </div>
        );
    }
}

/**
 * HighLight the object, list its props and turn the camera in front of it
 * @param props
 * @return {*}
 */
function objPropsView(props) {
    let currentObject = props.interactiveObjects.get(props.currentObject);
    let camera = document.querySelector("#camera");
    //let scenePrev = EditorState.debugState;

    let objGeometry = document.getElementById("curv" + currentObject.uuid);

    if (objGeometry) {
        objGeometry.setAttribute('material', 'color', 'green');
        turnCamera(camera, currentObject.uuid);
    }

    return (
        <div>
            <h2>Stato</h2>
            <div className={"buttonGroup"}>
                <button
                    title={"Torna all'elenco degli oggetti"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        if (objGeometry)
                            objGeometry.setAttribute('material', 'color', 'white');
                        interface_utils.setClassColor(".eudRule", "background: ");
                        interface_utils.setClassColor(".btnNext", "visibility: hidden");

                        props.updateCurrentScene(EditorState.debugState);

                    }}>
                    <img className={"action-buttons"} src={"icons/icons8-go-back-50.png"}
                         alt={'Torna all\'elenco degli oggetti'}/>
                </button>
            </div>
            <div className={'figure-grid'}>
                <img className={'rightbar-img'} src={getImage(currentObject.type)} alt={currentObject.type}
                     title={currentObject.type}/>
                <p>{currentObject.type}</p>
            </div>
            <label className={'rightbar-titles'}>Nome</label>
            <div className={'obj-props'}>
                <span className={"obj-props"}>
                    {currentObject.name}
                </span>
            </div>
            <label className={'rightbar-titles'}>Proprietà oggetto</label>
            {generateSpecificProperties(currentObject, props)}
        </div>
    );
}

/**
 * List player actions and all scenes objs
 * @param props
 * @return {*}
 */
function debugOptionsView(props) {
    let scene = props.scenes.get(props.currentScene);
    return (
        <div>
            <h2>Stato</h2>
            <label className={'rightbar-titles'}>Cerca</label>
            <div className={"rightbar-debug-element"}>
                <input type={'text'} id={'searchBar'} className={'bar-filters'} placeholder={'Cerca oggetto...'}
                       onChange={() => {
                           let filter = document.getElementById('searchBar').value;
                           props.updateObjectNameFilter(filter);
                       }}/>
            </div>
            <label className={'rightbar-titles'}>Azioni giocatore</label>
            <div className={"rightbar-debug-element"}>
                {listPlayerActions(scene, props)}
            </div>
            <label className={'rightbar-titles'}>Oggetti scena corrente</label>

            <div className={"rightbar-debug-element"}>
                <span className={"rightbar-scene-name"}>{scene.name}
                </span>
                {listCurrentSceneObjs(scene, props)}
            </div>
            <label className={'rightbar-titles'}>Oggetti altre scene</label>
            <div className={"rightbar-debug-element"}>
                {listOtherScenesObjs(props)}
            </div>
        </div>
    );
}

/**
 * List scene player actions
 * @param scene is the current scene
 * @param props
 */
function listPlayerActions(scene, props) {
    if (props.currentScene && scene) {
        if (scene.get('rules').length == 0) {
            return <div className={"player-div"}>
                <span>
                Non ci sono Azioni giocatore
                </span>
            </div>
        } else {
            return scene.get('rules').map(
                rule => {
                    let obj = props.interactiveObjects.get(props.rules.get(rule).event.obj_uuid);
                    if (obj) {
                        let objName = obj.name.length > 20 ? obj.name.substring(0, 16).concat("...") : obj.name;
                        let role = props.rules.get(rule).uuid;
                        return (
                            <div className={"player-div"}>
                                {getActionName(props.rules.get(rule).event.action)}
                                <span className={"player-obj"} id={"player-obj" + obj.uuid} onClick={() => {
                                    interface_utils.setClassColor(".player-obj, .obj-name", "color: ");
                                    interface_utils.setIdColor("obj-name" + obj.uuid, "color: rgba(239, 86, 55, 1)");
                                    interface_utils.setIdColor("player-obj" + obj.uuid, "color: rgba(239, 86, 55, 1)");
                                    interface_utils.setClassColor(".eudRule", "background: ");
                                    interface_utils.setClassColor(".btnNext", "visibility: hidden");

                                    props.rules.get(rule).actions._tail.array.forEach(function (sub) {
                                        if (sub.subj_uuid === obj.uuid) {
                                            interface_utils.setIdColor("rule" + role, "background: rgba(239, 86, 55, .3)");

                                            let next = document.getElementById("next" + role);
                                            if(next != null)
                                                next.style = "visibility: visible";
                                        }
                                    });

                                    if (props.rules.get(rule).event.obj_uuid === obj.uuid) {
                                        interface_utils.setIdColor("rule" + role, "background: rgba(239, 86, 55, .3)");

                                        let next = document.getElementById("next" + role);
                                        if(next != null)
                                            next.style = "visibility: visible";
                                    }
                                }
                                }>{objName}</span>
                            </div>
                        );
                    }
                });
        }
    } else {
        return null;
    }
}

/**
 * List current scene objects
 * @param props
 * @return {any[]}
 */
function listCurrentSceneObjs(scene, props) {
    let objects = Object.values(scene.objects).flat();
    let currentScene = props.scenes.get(props.currentScene);

    if (objects.length == 0) {
        return <div className={"player-div"}>
            Non ci sono oggetti nella scena
        </div>
    } else {
        return (objects.map(obj_uuid => {
            let obj = props.interactiveObjects.get(obj_uuid);
            let objName = obj.name.length > 20 ? obj.name.substring(0, 16).concat("...") : obj.name;

            if (objName.includes(props.editor.objectsNameFilter)) {
                return (
                    <div className={"rightbar-sections"}>
                        <img className={"icon-obj-left"} alt={obj.name} src={getImage(obj.type)}/>
                        <span className={"obj-name"} id={"obj-name" + obj.uuid} onClick={() => {
                            interface_utils.setClassColor(".player-obj, .obj-name", "color: ");
                            interface_utils.setIdColor("obj-name" + obj.uuid, "color: rgba(239, 86, 55, 1)");
                            interface_utils.setIdColor("player-obj" + obj.uuid, "color: rgba(239, 86, 55, 1)");
                            interface_utils.setClassColor(".eudRule", "background: ");
                            interface_utils.setClassColor(".btnNext", "visibility: hidden");
                            interface_utils.highlightRule(props, obj);
                            props.updateObject(objects);
                        }}>{objName}</span>
                        <button className={"select-file-btn btn"} id={"changeButton"} onClick={() => {

                            interface_utils.setClassColor(".eudRule", "background: ");
                            interface_utils.setClassColor(".btnNext", "visibility: hidden");
                            interface_utils.highlightRule(props, obj);

                            if (scene.uuid !== props.scenes.get(props.currentScene).uuid) {
                                props.updateCurrentScene(scene.uuid);
                            }

                            EditorState.debugState = props.scenes.get(props.currentScene).uuid;

                            props.updateCurrentObject(obj);
                        }}>
                            <img className={"action-buttons btn-img"} src={"icons/icons8-pencil-white-50.png"}
                                 alt={"Modifica"}/>
                        </button>
                    </div>
                );
            }
        }));
    }
}

/**
 * List other scenes objs grouped by scene
 * @param props
 * @return {any[]}
 */
function listOtherScenesObjs(props) {
    return ([...props.scenes.values()].map(child => {
        if (child.uuid !== props.scenes.get(props.currentScene).uuid) {
            return (
                <div className={"rightbar-other-scene"}>
                    <span className={"rightbar-scene-name"}>
                        {child.name}</span>
                    {listCurrentSceneObjs(child, props)}
                </div>
            );
        }
    }));
}

/**
 * Generate options according to the object type
 * @param object
 * @param props
 * @returns {*}
 */
function generateSpecificProperties(object, props) {
    switch (object.type) {
        case InteractiveObjectsTypes.TRANSITION:
            return (
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Durata:</label>
                    <div className={'flex'}>
                        <div id={"transitionDuration"}
                             className={"propertyForm-right"}
                             contentEditable={true}
                             onBlur={() => interface_utils.setPropertyFromId(object, 'duration', "transitionDuration", props)}
                             onInput={() => interface_utils.onlyNumbers("transitionDuration")}
                        >
                            {object.properties.duration}
                        </div>
                        <span className={'measure-units'}>ms</span>
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.SWITCH:
            return (
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
            return (<div>Error!</div>);

    }
}

/**
 * Returns link to img according to the object type
 * @param type
 * @returns {string}
 */
function getImage(type) {

    switch (type) {
        case InteractiveObjectsTypes.TRANSITION:
            return "icons/icons8-one-way-transition-100.png";
        case InteractiveObjectsTypes.SWITCH:
            return "icons/icons8-toggle-on-filled-100.png";
        case  InteractiveObjectsTypes.KEY:
            return "icons/icons8-key-100.png";
        case InteractiveObjectsTypes.LOCK:
            return "icons/icons8-lock-100.png";
        default:
            return "?";
    }
}


/**
 * ToString of an RuleActionType
 * @param action
 * @return {*}
 */
function getActionName(action) {
    switch (action) {
        case RuleActionTypes.CLICK:
            return <span className={"player-action"}>Preme </span>;
        case RuleActionTypes.FLIP_SWITCH:
            return <span className={"player-action"}>Aziona </span>;
        case RuleActionTypes.COLLECT_KEY:
            return <span className={"player-action"}>Raccoglie</span>;
        default:
            return <span className={"player-action"}>Interagisce </span>
    }

}

function handleClickOutside(props) {
    document.addEventListener("click", (evt) => {
        const debugDiv = document.getElementById("rbContainer");
        let targetElement = evt.target; // clicked element
        let classTarget = evt.target.getAttribute("class");

        do {
            if (targetElement === debugDiv) {
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // This is a click outside.
        interface_utils.setClassColor(".player-obj, .obj-name", "color: ");
        if (classTarget !== "select-file-btn btn" && classTarget !== "a-canvas a-grab-cursor" && classTarget !== "action-buttons btn-img") {
            interface_utils.setClassColor(".eudRule", "background: ");
            interface_utils.setClassColor(".btnNext", "visibility: hidden");
        }

    });
}

function turnCamera(camera, objId) {
    var obj = document.querySelector("#curv" + objId);
    obj.components.geometry.geometry.computeBoundingSphere();
    var center = obj.components.geometry.geometry.boundingSphere;
    var l = center.center.normalize();
    var cameraPosition = camera.getAttribute('position');
    var radius = document.querySelector("a-videosphere").getAttribute('radius');
    var v = new THREE.Vector3(cameraPosition.x, cameraPosition.y, -radius).normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(v, l);
    var euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion, 'YXZ', false);
    camera.components["pac-look-controls"].yawObject.rotation._y = euler._y;
    camera.components["pac-look-controls"].yawObject.rotation._x = 0;
    camera.components["pac-look-controls"].yawObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._x = euler._x;
    camera.components["pac-look-controls"].pitchObject.rotation._z =  0;
    camera.components["pac-look-controls"].pitchObject.rotation._y =  0;
}

export default DebugTab;