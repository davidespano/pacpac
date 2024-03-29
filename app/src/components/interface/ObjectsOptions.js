import React from 'react';
import interface_utils from "./interface_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import Actions from "../../actions/Actions";
import Dropdown from "./Dropdown";
import Values from "../../rules/Values";
import RuleActionTypes from "../../rules/RuleActionTypes";
import stores_utils from "../../data/stores_utils";
import Orders from "../../data/Orders";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObject from "../../interactives/InteractiveObject";
import {createObject} from "./Topbar";
import scene_utils from "../../scene/scene_utils";


function ObjectOptions(props){
    //faccio in modo che la ghost scene non appaia quando creo un nuovo oggetto globale
    let scene = props.scenes.get(props.objectToScene.get(props.currentObject));

    if(props.currentObject && scene.uuid !='ghostScene'){
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
    let geometryButton = null;
    let visibilityDropdown = null;
    let activabilityDropdown = null;
    if(currentObject.type == InteractiveObjectsTypes.PLAYTIME ||
        currentObject.type == InteractiveObjectsTypes.SCORE ||
        currentObject.type == InteractiveObjectsTypes.HEALTH ||
        currentObject.type == InteractiveObjectsTypes.FLAG ||
        currentObject.type == InteractiveObjectsTypes.NUMBER ||
        currentObject.type == InteractiveObjectsTypes.TIMER ||
        currentObject.type == InteractiveObjectsTypes.TEXTBOX ||
        currentObject.type == InteractiveObjectsTypes.KEYPAD)
    {}
    else
    {// gli oggetti globali e alcuni altri non hanno bisogno della geometria impostata dall'utente
        geometryButton =
            <div className={'options-grid'}>
            <label className={'options-labels'}>Geometria:</label>
            <button
                className={"btn select-file-btn rightbar-btn"}
                onClick={() => props.switchToGeometryMode() }
                disabled={(currentObject.type === InteractiveObjectsTypes.POINT_OF_INTEREST && objectScene.type === Values.TWO_DIM)}
            >
                Modifica geometria
            </button>
        </div>
    }

    if(currentObject.type == InteractiveObjectsTypes.FLAG ||
        currentObject.type == InteractiveObjectsTypes.NUMBER)
    {}
    else{
        visibilityDropdown = <div className={'options-grid'}>
            <label className={'options-labels'}>Visibilità:</label>
            <Dropdown
                props={props}
                component={'visibility'}
                property={'visible'}
                defaultValue={currentObject.visible}/>
        </div>

        activabilityDropdown = <div className={'options-grid'}>
            <label className={'options-labels'}>Attivazione:</label>
            <Dropdown
                props={props}
                component={'activability'}
                property={'activable'}
                defaultValue={currentObject.activable}/>
        </div>
    }

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
                <input readOnly className={'propertyForm objectName'}
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
            {visibilityDropdown}
            {activabilityDropdown}
            {geometryButton}

            {generateSpecificProperties(currentObject, objectScene, props)}

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
    if (currentObject.type === InteractiveObjectsTypes.SELECTOR){
        let n = currentObject.properties.optionsNumber;
        return <React.Fragment>
            <label className={'rightbar-titles'}>Media:</label>
            <div className={'rightbar-audio-media-grid'}>
                {Object.keys(currentObject.media).map( m => {
                    n = n -1;
                    if (n>=0){
                        return(
                            <React.Fragment key={currentObject.uuid + '-' + m}>
                                <p className={'rightbar-audio-media-grid-title'}>Media {optionToName(currentObject.type, m)}</p>
                                <Dropdown props={props}
                                          component={'assets'}
                                          property={m}
                                          defaultValue={currentObject.media[m]} />
                            </React.Fragment>
                        );
                    }
                    else
                        return;
                })}
                <p className={'rightbar-audio-media-grid-title'}>Maschera</p>
                <Dropdown props={props}
                          component={'assets'}
                          property={'mask'}
                          defaultValue={currentObject.mask} />
            </div>
        </React.Fragment>
    }
    else {
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
                             suppressContentEditableWarning={true}
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
            let scene = props.scenes.get(props.currentScene);
            let buttonsValues = object.properties.buttonsValues; //leggo la mappa contenente i riferimenti a pulsanti e valori corrispondenti
            let buttonList = Object.keys(buttonsValues).map(button => {
                let obj = props.interactiveObjects.get(button);
                let buttonValueID = obj.name +"value"
                return (
                    <React.Fragment key={buttonValueID}>
                        <p className={'objectsList-element-delete-button buttonValuesLabels'}
                           onClick={()=> props.updateCurrentObject(obj)}>
                            <img className={"object-thumbnail"} src={interface_utils.getObjImg(obj.type)}/>
                            {obj.name}
                        </p>
                        <div>
                            <div id={buttonValueID}
                                 className={"propertyForm-right button-Value"}
                                 contentEditable={true}
                                 onBlur={()=> {
                                     let value = document.getElementById(buttonValueID).textContent;
                                     interface_utils.setButtonsValues(object, obj.uuid, value, props);//questa è una funzione fatta appositamente
                                 }}
                                 onInput={() => interface_utils.onlyNumbers(buttonValueID)}
                            >
                                {buttonsValues[button]}
                            </div>

                        </div>
                        <div>
                            <img className={"waste-action-buttons"}
                                 src={"icons/icons8-waste-50.png"}
                                 alt={'Cancella'}
                                 onClick={() => {
                                     let answer = window.confirm("Vuoi cancellare l'oggetto " + obj.name + "?");
                                     if (answer) {
                                         InteractiveObjectAPI.removeObject(scene, obj, props);
                                         props.updateCurrentObject(null);
                                     }
                                 }}
                            />
                        </div>
                    </React.Fragment>
                );
            });

            return(
                <React.Fragment>
                    <div className={"options-grid"}>
                        <label className={'options-labels'}>Combinazione corretta:</label>
                        <div className={'flex'}>
                            <div id={"combination"}
                                 suppressContentEditableWarning={true}
                                 className={"propertyForm-right"}
                                 contentEditable={true}
                                 onBlur={()=> interface_utils.setPropertyFromId(object,'combination',"combination", props)}
                                 onInput={() => interface_utils.onlyNumbers("combination")}
                            >
                                {object.properties.combination}
                            </div>
                        </div>
                    </div>
                    <label className={'rightbar-titles'}>Pulsanti:</label>

                    <div className={'options-grid'}>
                        <label className={'options-labels'}>Geometria pulsante Invio:</label>
                        <button
                            className={"btn select-file-btn rightbar-btn"}
                            onClick={() => props.switchToGeometryMode()}>
                            Modifica geometria
                        </button>
                    </div>

                    <div className={'options-grid'}>
                        <label className={'options-labels'}>
                            <img className={"object-thumbnail"}
                                 src={interface_utils.getObjImg(InteractiveObjectsTypes.BUTTON)}/>Aggiungi:</label>
                        <button
                            className={"btn select-file-btn rightbar-btn"}
                            onClick={() => createObject(props, InteractiveObjectsTypes.BUTTON)}
                        >
                            Nuovo pulsante
                        </button>
                    </div>



                    <div className={"tri-options-grid"}>
                        {buttonList}
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.TEXTBOX:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Testo:</label>
                    {richText(props,object)}
                    <label className={'options-labels'}>Dimensione testo:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.fontSize} //se uso value non fa scorrere lo slider
                            id="textSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'fontSize',"textSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'fontSize',"textSize", props)}
                        />
                    </div>

                    <label className={'options-labels'}>Dimensione box:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.boxSize}
                            id="boxSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'boxSize',"boxSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'boxSize',"boxSize", props)}
                        />
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.SELECTOR:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Selettore:</label>
                    <label className={'options-labels'}>Numero opzioni:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={parseInt(object.properties.optionsNumber)}
                            id="optionsNumber"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={3}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'optionsNumber',"optionsNumber", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'optionsNumber',"optionsNumber", props)}
                        />
                    </div>
                </React.Fragment>

            );
        case InteractiveObjectsTypes.TIMER:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Opzioni Timer:</label>
                    <div className={'options-grid'}>
                        <label className={'options-labels'}>Tempo:</label>
                        <div className={'flex'}>
                            <div id={"timerDuration"}
                                 className={"propertyForm-right"}
                                 contentEditable={true}
                                 onBlur={()=> interface_utils.setPropertyFromId(object,'time',"timerDuration", props)}
                                 onInput={() => interface_utils.onlyNumbers("timerDuration")}
                            >
                                {object.properties.time}
                            </div>
                            <span className={'measure-units'}> secondi</span>
                        </div>
                    </div>
                    <div className={'options-grid'}>
                        <label className={'options-labels'}>Avvio automatico:</label>
                        <div className={'flex'}>
                            <div className={'rightbar-checkbox'}>
                                <input type={'checkbox'} className={'checkbox-audio-form'}
                                       id={'timer-autostart'} checked={object.properties.autoStart}
                                       onChange={() => {
                                           interface_utils.setPropertyFromValue(object,'autoStart', !object.properties.autoStart,props)
                                       }}
                                />
                            </div>
                        </div>
                    </div>

                    <label className={'options-labels'}>Dimensione box:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.size}
                            id="timerSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'size',"timerSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'size',"timerSize", props)}
                        />
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.BUTTON:
            let properties = object.get('properties');
            let keypad = props.interactiveObjects.get(properties['keypadUuid']);
            if (keypad != undefined)//se è presente il keypad nella scena, ne mostro il riferimento
            {
                return(
                    <React.Fragment>
                        <label className={'rightbar-titles'}>Tastierino di riferimento:</label>
                        <div className={"options-grid"}>
                            <p className={'objectsList-element-delete-button'}
                               onClick={()=> props.updateCurrentObject(keypad)}>
                                <img className={"object-thumbnail"} src={interface_utils.getObjImg(keypad.type)}/>
                                {keypad.name}
                            </p>
                        </div>
                    </React.Fragment>
                );
            }
            else
            {
                return
            }
        case InteractiveObjectsTypes.PLAYTIME:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Tempo di gioco:</label>
                    <label className={'options-labels'}>Dimensione box:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.size}
                            id="gameTimeSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'size',"gameTimeSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'size',"gameTimeSize", props)}
                        />
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.SCORE:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Punteggio:</label>
                    <label className={'options-labels'}>Dimensione box:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.size}
                            id="scoreSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'size',"scoreSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'size',"scoreSize", props)}
                        />
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.HEALTH:
            return (
                <React.Fragment>
                    <label className={'rightbar-titles'}>Opzioni vita:</label>
                    <label className={'options-labels'}>Punti vita iniziali:</label>
                    <div className={'flex'}>
                        <div id={"startingHealth"}
                             className={"propertyForm-right"}
                             contentEditable={true}
                             onBlur={()=> interface_utils.setPropertyFromId(object,'health',"startingHealth", props)}
                             onInput={() => interface_utils.onlyNumbers("startingHealth")}
                        >
                            {object.properties.health}
                        </div>
                        <span className={'measure-units'}> Punti vita</span>
                    </div>
                    <label className={'options-labels'}>Dimensione box:</label>
                    <div className={'flex'}>
                        <Slider
                            defaultValue={object.properties.size}
                            id="healthSize"
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={()=> interface_utils.setPropertyFromId(object,'size',"healthSize", props)}
                            onBlur={()=> interface_utils.setPropertyFromId(object,'size',"healthSize", props)}
                        />
                    </div>
                </React.Fragment>
            );
        case InteractiveObjectsTypes.FLAG:
            let flags = [];
            for (let i = 0; i< object.properties.id.length; i++){
                flags.push(
                    <React.Fragment key={object.uuid +"flag"+i}>
                        <input type={"text"} className={'rightbar-audio-media-grid-title'}
                               defaultValue={object.properties.name[i]}
                               maxLength={50}
                               onChange={(e) => {
                                   let value = e.target.value;
                                   if (value !== ""){
                                       interface_utils.setPropertyGlobalVariable(object,'name', value, props, i);
                                   }
                               }}
                               onBlur={(e) => {
                                   let value = e.target.value;
                                   if(value !== ""){
                                       object.properties.name[i] = value;
                                   }
                               }}/>
                        <Dropdown props={props}
                                  component={'true-false'}
                                  property={"value"}
                                  defaultValue={object.properties.value[i]}
                                  index={i}
                        />
                    </React.Fragment>
                )
            }
            return(
                <div className={"options-grid"}>
                    <div key={object.uuid + '-flag'}>
                        {flags}
                    </div>
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
function objectButtons(props){ //FUNZIONE LISTA OGGETTI SCENA RIGHTBAR
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
                        //TODO: per i globali, rimuove dalla lista in interfaccia solo dopo clic su un altro pannello... why?
                        InteractiveObjectAPI.removeObject(scene, currentObject, props);
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
                       onClick={()=> props.updateCurrentObject(obj)}>
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
        //let currentObject = props.interactiveObjects.get(props.currentObject);
        return (allObjects.map(obj_uuid => {
            let obj = props.interactiveObjects.get(obj_uuid);
            if(obj.name.includes(props.editor.objectsNameFilter)){
                return (
                    <div key={obj.uuid} className={"objects-wrapper"}>
                        <p className={'objectsList-element-delete-button'}
                           onClick={()=> props.updateCurrentObject(obj)}>
                            <img className={"object-thumbnail"} src={interface_utils.getObjImg(obj.type)}/>
                            {obj.name}
                        </p>
                        <img className={"waste-action-buttons"}
                             src={"icons/icons8-waste-50.png"}
                             alt={'Cancella'}
                             onClick={() => {
                                 let answer = window.confirm("Vuoi cancellare l'oggetto " + obj.name + "?");
                                 if (answer) {
                                     InteractiveObjectAPI.removeObject(scene, obj, props);
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
        case InteractiveObjectsTypes.SELECTOR:
            return selectorOptionsNames(option);
        default:
            return '';
    }
}

function switchOptionsNames(option){
    switch(option){
        case 'audio0':
        case 'media0': return 'on -> off';
        case 'audio1':
        case 'media1': return 'off -> on';
        default: break;
    }
}

function selectorOptionsNames(option) {
    switch(option){
        case 'media1': return 'opzione 1';
        case 'media2': return 'opzione 2';
        case 'media3': return 'opzione 3';
        case 'media4': return 'opzione 4';
        case 'media5': return 'opzione 5';
        case 'media6': return 'opzione 6';
        case 'media7': return 'opzione 7';
        case 'media8': return 'opzione 8';
        case 'media9': return 'opzione 9';
        case 'media10': return 'opzione 10';
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
        case InteractiveObjectsTypes.KEY:
            return "Chiave";
        case InteractiveObjectsTypes.TRANSITION:
            return "Transizione";
        case InteractiveObjectsTypes.TIMER:
            return "Timer";
        case InteractiveObjectsTypes.TEXTBOX:
            return "Testo";
        case InteractiveObjectsTypes.KEYPAD:
            return "Tastierino";
        case InteractiveObjectsTypes.HEALTH:
            return "Vita";
        case InteractiveObjectsTypes.FLAG:
            return "Flag";
        case InteractiveObjectsTypes.NUMBER:
            return "Numero";
        case InteractiveObjectsTypes.SCORE:
            return "Punteggio";
        case InteractiveObjectsTypes.PLAYTIME:
            return "Tempo di gioco";
        case RuleActionTypes.RULES:
            return "Regola";
        default:
            return "Sconosciuto";
    }
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

function checkRichtextButtonActive(value, current) {
    return current == value? '-active' : '';
}

function richText(props, object){

    return (
        <React.Fragment>
            <div className={'audio-list-box-btns'}>
                <button
                    title={"Allinea a sinistra"}
                    className={"action-buttons-container rich-text-buttons" + checkRichtextButtonActive(Values.TEXTLEFT, object.properties.alignment)}
                    onClick={() => {
                        interface_utils.setPropertyFromValue(object, 'alignment', Values.TEXTLEFT, props);
                    }}
                >
                    <img className={"action-buttons"} src={"icons/icons8-allinea-a-sinistra-96" +
                    checkRichtextButtonActive(Values.TEXTLEFT, object.properties.alignment) + '.png'} alt={'Allinea a sinistra'}/>
                </button>

                <button
                    title={"Allinea al centro"}
                    className={"action-buttons-container rich-text-buttons" + checkRichtextButtonActive(Values.TEXTCENTER, object.properties.alignment)}
                    onClick={() => {
                        interface_utils.setPropertyFromValue(object, 'alignment', Values.TEXTCENTER, props);
                    }}
                >
                    <img className={"action-buttons"} src={"icons/icons8-allinea-al-centro-96"  +
                    checkRichtextButtonActive(Values.TEXTCENTER, object.properties.alignment ) + '.png'} alt={'Allinea al centro'}/>
                </button>

                <button
                title={"Allinea a destra"}
                className={"action-buttons-container rich-text-buttons" + checkRichtextButtonActive(Values.TEXTRIGHT, object.properties.alignment)}
                onClick={() => {
                    interface_utils.setPropertyFromValue(object, 'alignment', Values.TEXTRIGHT, props);
                }}
            >
                <img className={"action-buttons"} src={"icons/icons8-allinea-a-destra-96" +
                checkRichtextButtonActive(Values.TEXTRIGHT, object.properties.alignment) + '.png'} alt={'Allinea a destra'}/>
            </button>

            </div>
            <textarea id={"textboxString"} maxlength={258}
                      onBlur={()=> {
                          let value = document.getElementById("textboxString").value;
                          interface_utils.setPropertyFromValue(object, 'string', value, props)
                      }}
            >
                    {object.properties.string}
            </textarea>
        </React.Fragment>
    );
}

export default ObjectOptions;