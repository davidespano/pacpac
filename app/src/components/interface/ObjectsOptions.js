import React from 'react';
import interface_utils from "./interface_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import OpenHabAPI from "../../utils/OpenHabAPI"
import Actions from "../../actions/Actions";
import Dropdown from "./Dropdown";
import Values from "../../rules/Values";

function ObjectOptions(props){
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


/**
 * Generates options of currently selected object
 * @param props
 * @returns {*}
 */
function generateProperties(props){

    let currentObject = props.interactiveObjects.get(props.currentObject);
    let objectScene = props.scenes.get(props.objectToScene.get(currentObject.uuid));
    let type = objectTypeToString(currentObject.type);


    return(
        <div className={'currentOptions'}>
            {objectButtons(props)}
            <div className={'figure-grid'}>
                <img className={'rightbar-img'} src={interface_utils.getObjImg(currentObject.type)} alt={type} title={type}/>
                <p>{type}</p>
            </div>
            <label className={'rightbar-titles'}>Nome</label>
            <input id={"objectName"}
                   className={"propertyForm"}
                   value={props.editor.objectNameRightbar}
                   minLength={1}
                   maxLength={50}
                   onChange={(e) => {
                       let value = e.target.value;
                       if(value!==''){
                           props.updateObjectNameRightbar(value);
                       }
                   }}
                   onBlur={() => {
                       if(currentObject.name !== props.editor.objectNameRightbar){
                           interface_utils.setPropertyFromValue(currentObject,'name', props.editor.objectNameRightbar, props);
                       }
                   }}
            />
            <label className={'rightbar-titles'}>Scena di appartenenza</label>
            <div className={'rightbar-grid'}>
                <input className={'propertyForm objectName'}
                       value={objectScene.name}
                />
                <button
                    title={"Vai alla scena"}
                    className={"select-file-btn btn"}
                    onClick={() => {
                        props.updateCurrentScene(objectScene.uuid);
                        props.updateCurrentObject(currentObject);
                        props.rightbarSelection('objects');
                    }}
                >
                    <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-white-image-50.png"}/>
                </button>
            </div>
            <label className={'rightbar-titles'}>Opzioni</label>
            <div className={'options-grid'}>
                <label className={'options-labels'}>Attivazione:</label>
                <Dropdown
                    props={props}
                    component={'visibility'}
                    property={'visible'}
                    defaultValue={currentObject.visible}/>
            </div>
            {generateSpecificProperties(currentObject, objectScene, props)}
            <div className={'options-grid'}>
                <label className={'options-labels'}>Geometria:</label>
                <button
                    className={"btn select-file-btn rightbar-btn"}
                    onClick={() => props.switchToGeometryMode() }
                    disabled={currentObject.type === InteractiveObjectsTypes.POINT_OF_INTEREST && objectScene.type === Values.TWO_DIM}
                >
                    Modifica geometria
                </button>
            </div>
            {currentObject.media? mediaProperties(currentObject, props) : null}
            {currentObject.audio? audioProperties(currentObject, props) : null}
        </div>
    );
}

/**
 * returns media properties view
 * @param currentObjects
 * @param props
 * @returns {*}
 */
function mediaProperties(currentObject, props){
    return <React.Fragment>
        <label className={'rightbar-titles'}>Media:</label>
        <div className={'rightbar-audio-media-grid'}>
            {Object.keys(currentObject.media).map( m => {
                return(
                    <React.Fragment key={currentObject.uuid + '-' + m}>
                        <p className={'rightbar-audio-media-grid-title'}>Media {optionToName(currentObject.type, m)}</p>
                        <Dropdown props={props}
                                  component={'assets'}
                                  property={m}
                                  defaultValue={currentObject.media[m]} />
                    </React.Fragment>
                );
            })}
            <p className={'rightbar-audio-media-grid-title'}>Maschera</p>
            <Dropdown props={props}
                      component={'assets'}
                      property={'mask'}
                      defaultValue={currentObject.mask} />
        </div>
    </React.Fragment>
}

/**
 * returns audio properties view
 * @param currentObject
 * @param props
 * @returns {*}
 */
function audioProperties(currentObject, props){
    return <React.Fragment>
        <label className={'rightbar-titles'}>Audio:</label>
        <div className={'rightbar-audio-media-grid'}>
            {Object.keys(currentObject.audio).map( a => {
                return(
                    <React.Fragment key={currentObject.uuid + '-' + a}>
                        <p className={'rightbar-audio-media-grid-title'}>Audio {optionToName(currentObject.type, a)}</p>
                        <Dropdown
                            props={props}
                            component={'audios'}
                            property={a}
                            defaultValue={currentObject.audio[a]} mediaToEdit={a}/>
                    </React.Fragment>
                );
            })}
        </div>
    </React.Fragment>
}

/**
 * returns iot properties view
 * @param currentObject
 * @param props
 * @returns {*}
 */
function iotProperties(currentObject, props){
    return <React.Fragment>
        <div className={'options-grid'}>
            <p className={'options-labels'}>Dispositivo:</p>
            <Dropdown
                props={props}
                component={'devices'}
                property={'devices'}
                deviceFilter={currentObject}
                defaultValue={currentObject.deviceUuid}/>
        </div>
        {currentObject.type != InteractiveObjectsTypes.SENSOR
        && currentObject.type != InteractiveObjectsTypes.MOTION_DETECTOR
        && currentObject.type != InteractiveObjectsTypes.SMOKE_DETECTOR ?
            <label className={'rightbar-titles'}>Valori iniziali:</label> : ""
        }
        {currentObject.type == InteractiveObjectsTypes.LIGHT
        || currentObject.type == InteractiveObjectsTypes.AIR_CONDITIONER
        || currentObject.type == InteractiveObjectsTypes.POWER_OUTLET
        || currentObject.type == InteractiveObjectsTypes.DSWITCH
        || currentObject.type == InteractiveObjectsTypes.SIREN
        || currentObject.type == InteractiveObjectsTypes.SPEAKER ?
                (<div className={'options-grid'}>
                    <p className={'options-labels'}>Accensione:</p>
                    <Dropdown
                        props={props}
                        component={'on-off'}
                        property={'state'}
                        defaultValue={currentObject.properties.state.state}/>
                </div>) : ""
        }
        {currentObject.type == InteractiveObjectsTypes.LIGHT ?
            (<div className={'options-grid'}>
                <p className={'options-labels'}>Colore:</p>
                <input id={"objectColor"} type={"color"}
                       className={"propertyForm"}
                       value={rgbToHex(hslToRgb(currentObject.properties.state.color))}
                       onChange={(e) => {
                           let value = e.target.value;
                           if(value!==''){
                               value = hexToRgb(value);
                               value = rgbToHsl(value.r, value.g, value.b);
                               interface_utils.setPropertyFromValue(currentObject, 'state', value, props, 'color');
                           }
                       }}/>
            </div>): ""
        }
        {currentObject.type == InteractiveObjectsTypes.AIR_CONDITIONER ?
                (<div className={'options-grid'}>
                    <p className={'options-labels'}>Temperatura:</p>
                    <input id={"objectTemperature"} type={"number"}
                           className={"propertyForm"}
                           value={currentObject.properties.state.temperature}
                           onChange={(e) => {
                               let value = e.target.value;
                               if(value!==''){
                                   interface_utils.setPropertyFromValue(currentObject, 'state', value, props, 'temperature');
                               }
                           }}
                    />
                </div>) : ""
        }
        {currentObject.type == InteractiveObjectsTypes.SPEAKER
        || currentObject.type == InteractiveObjectsTypes.SIREN ?
                (<div className={'options-grid'}>
                    <p className={'options-labels'}>Volume:</p>
                    <input id={"objectTemperature"} type={"number"}
                           className={"propertyForm"}
                           min={0} max={100}
                           value={currentObject.properties.state.volume}
                           onChange={(e) => {
                               let value = e.target.value;
                               if(value!==''){
                                   interface_utils.setPropertyFromValue(currentObject, 'state', value, props, 'volume');
                               }
                           }}
                    />
                </div>) : ""
        }
        {currentObject.type == InteractiveObjectsTypes.BLIND ?
                (<div className={'options-grid'}>
                    <p className={'options-labels'}>Apertura:</p>
                    <input id={"objectTemperature"} type={"number"}
                           className={"propertyForm"}
                           min={0} max={100}
                           value={currentObject.properties.state.roller}
                           onChange={(e) => {
                               let value = e.target.value;
                               if(value!==''){
                                   interface_utils.setPropertyFromValue(currentObject, 'state', value, props, 'roller');
                               }
                           }}
                    />
                </div>) : ""
        }
        {currentObject.type == InteractiveObjectsTypes.DOOR ?
                (<div className={'options-grid'}>
                    <p className={'options-labels'}>Serratura:</p>
                    <Dropdown
                        props={props}
                        component={'locked-unlocked'}
                        property={'state'}
                        defaultValue={currentObject.properties.state.lock}/>
                </div>) : ""
        }
        <label className={'rightbar-titles'}>Collegamento proprietà:</label>
        {Object.keys(currentObject.deviceStateMapping).map(key =>
            (<div className={'options-grid'}>
                    <p className={'options-labels'}>{key}:</p>
                    <Dropdown
                        props={{...props, channel: key}}
                        component={'thing-channel'}
                        defaultValue={currentObject.deviceStateMapping[key].deviceChannel}/>
                </div>))
        }
        <label className={'rightbar-titles'}>Grafica editor:</label>
    </React.Fragment>;
}

/**
 * Generate options according to the object type
 * @param object
 * @param objectScene scene the obj belongs to
 * @param props
 * @returns {*}
 */
function generateSpecificProperties(object, objectScene, props){
    let sceneType = objectScene.type;

    switch(object.type){
        case InteractiveObjectsTypes.TRANSITION:
            let direction = null;
            if(sceneType === Values.TWO_DIM){
                direction = <React.Fragment>
                    <label className={'options-labels'}>Direzione:</label>
                    <Dropdown
                        props={props}
                        component={'direction'}
                        property={'direction'}
                        defaultValue={object.properties.direction}/>
                </React.Fragment>;
            }
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
                    {direction}
                </div>
            );
        case InteractiveObjectsTypes.SWITCH:
            return(
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Stato iniziale:</label>
                    <Dropdown
                        props={props}
                        component={'on-off'}
                        property={'state'}
                        defaultValue={object.properties.state}/>
                </div>
            );
        case InteractiveObjectsTypes.KEY:
            return (
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Stato iniziale:</label>
                    <Dropdown
                        props={props}
                        component={'collected-not'}
                        property={'state'}
                        defaultValue={object.properties.state}/>
                </div>
            );
        case InteractiveObjectsTypes.LOCK:
            return null;
        case InteractiveObjectsTypes.POINT_OF_INTEREST:
            return (
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Delay:</label>
                    <div className={'flex'}>
                        <div id={"point-of-interest-delay"}
                             className={"propertyForm-right"}
                             contentEditable={true}
                             onBlur={()=> interface_utils.setPropertyFromId(object,'delay',"point-of-interest-delay", props)}
                             onInput={() => interface_utils.onlyNumbers("point-of-interest-delay")}
                        >
                            {object.properties.delay}
                        </div>
                        <span className={'measure-units'}>ms</span>
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.COUNTER:
            return (
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Valore iniziale:</label>
                    <div id={"counterValue"}
                         className={"propertyForm-right propertyForm-right-number"}
                         contentEditable={true}
                         onBlur={()=> interface_utils.setPropertyFromId(object,'state',"counterValue", props)}
                         onInput={() => interface_utils.onlyNumbers("counterValue")}
                    >
                        {object.properties.state}
                    </div>
                    <label className={'options-labels'}>Passo:</label>
                    <div id={"counterStep"}
                         className={"propertyForm-right propertyForm-right-number"}
                         contentEditable={true}
                         onBlur={()=> interface_utils.setPropertyFromId(object,'step',"counterStep", props)}
                         onInput={() => interface_utils.onlyNumbers("counterStep")}
                    >
                        {object.properties.step}
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.KEYPAD:
            return(
                <div className={"options-grid"}>
                    <label className={'options-labels'}>Numero tasti:</label>
                    <div className={'flex'}>
                        <div id={"keypadSize"}
                             className={"propertyForm-right"}
                             contentEditable={true}
                             onBlur={()=> {
                                 let size = document.getElementById('keypadSize').textContent;
                                 interface_utils.changeKeypadSize(object, size);
                             }}
                             onInput={() => interface_utils.onlyNumbers("keypadSize")}
                        >
                            {object.properties.duration}
                        </div>
                        <span className={'measure-units'}>ms</span>
                    </div>
                </div>
            );
        case InteractiveObjectsTypes.BLIND:
        case InteractiveObjectsTypes.DOOR:
        case InteractiveObjectsTypes.AIR_CONDITIONER:
        case InteractiveObjectsTypes.LIGHT:
        case InteractiveObjectsTypes.MOTION_DETECTOR:
        case InteractiveObjectsTypes.POWER_OUTLET:
        case InteractiveObjectsTypes.DSWITCH:
        case InteractiveObjectsTypes.SENSOR:
        case InteractiveObjectsTypes.SIREN:
        case InteractiveObjectsTypes.SMOKE_DETECTOR:
        case InteractiveObjectsTypes.SPEAKER:
            return iotProperties(object, props);
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
                title={"Cancella"}
                className={"action-buttons-container"}
                onClick={() => {
                    let answer = window.confirm("Vuoi cancellare l'oggetto " + currentObject.name + "?");
                    if(answer){
                        OpenHabAPI.updateBinding(currentObject, "");
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
                       onClick={()=> {
                           props.updateCurrentObject(obj);
                       }}>
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
                           onClick={()=> {
                               props.updateCurrentObject(obj);
                           }}>
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

function optionToName(objType, option){
    switch(objType){
        case InteractiveObjectsTypes.SWITCH:
            return switchOptionsNames(option);
        default:
            return '';
    }
}

function switchOptionsNames(option){
    switch(option){
        case 'audio0':
        case 'media0': return 'on-off';
        case 'audio1':
        case 'media1': return 'off-on';
        default: break;
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
        case InteractiveObjectsTypes.POINT_OF_INTEREST:
            return "Punto di interesse";
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
        case InteractiveObjectsTypes.BLIND:
            return "Serranda";
        case InteractiveObjectsTypes.DOOR:
            return "Porta";
        case InteractiveObjectsTypes.AIR_CONDITIONER:
            return "Condizionatore";
        case InteractiveObjectsTypes.LIGHT:
            return "Luce";
        case InteractiveObjectsTypes.MOTION_DETECTOR:
            return "Sensore di movimento";
        case InteractiveObjectsTypes.POWER_OUTLET:
            return "Presa elettrica";
        case InteractiveObjectsTypes.DSWITCH:
            return "Interruttore";
        case InteractiveObjectsTypes.SENSOR:
            return "Sensore generico";
        case InteractiveObjectsTypes.SIREN:
            return "Sirena";
        case InteractiveObjectsTypes.SMOKE_DETECTOR:
            return "Sensore fumo";
        case InteractiveObjectsTypes.SPEAKER:
            return "Altoparlante";
        default:
            return "Sconosciuto";
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hslToRgb(text){
var r, g, b;

if (!text) return "0,0,0";

var values = text.replace(/\s/g, '').split(',');
var h = parseInt(values[0]) / 360;
var s = parseInt(values[1]) / 100;
var l = parseInt(values[2]) / 100;

if(s == 0){
    r = g = b = l; // achromatic
}else{
    var hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
}

return Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255);
}

function rgbToHsl(r, g, b)
{
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) { h = s = 0; }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return ((h*360+0.5)|0) + "," + ((s*100+0.5)|0) + "," + ((l*100+0.5)|0);
}


function rgbToHex(text) {
    var values = text.replace(/\s/g, '').split(',');
    var r = parseInt(values[0]);
    var g = parseInt(values[1]);
    var b = parseInt(values[2]);

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

/*
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
*/

export default ObjectOptions;
