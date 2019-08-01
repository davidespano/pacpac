import React from 'react';
import scene_utils from "../../scene/scene_utils";
import stores_utils from "../../data/stores_utils";
import interface_utils from "./interface_utils";
import Orders from "../../data/Orders";
import FileSelectionBtn from "./FileSelectionBtn";
import TagDropdown from "./TagDropdown";
import Dropdown from "./Dropdown";

function SceneOptions(props){

    let properties = {
        props : props,
        component : 'rightbar',
    };

    let checked = props.editor.soundActiveRightbarChecked;


    if(props.currentScene){
        let scene = props.scenes.get(props.currentScene);
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
                    <input id={"sceneName"}
                           className={"propertyForm rightbar-box"}
                           value={props.editor.sceneNameRightbar}
                           maxLength={50}
                           minLength={1}
                           onChange={(e) => {
                               let value = e.target.value;
                               if(value !== ''){
                                   props.updateSceneNameRightbar(value);
                               }
                           }}
                           onBlur={() => {
                               if(scene.name !== props.editor.sceneNameRightbar){
                                   scene_utils.setProperty(scene, 'name', props.editor.sceneNameRightbar, props);
                               }
                           }}
                    />
                    <div>
                        <Dropdown props={props}
                                  component={'scene-type'}
                                  property={'type'}
                                  defaultValue={scene.type}/>
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
                        <p className={'file-selected-name propertyForm ellipsis-no-inline'}>{scene.img}</p>
                    </div>
                    <FileSelectionBtn {...properties} />
                    <div className={'rightbar-checkbox'}>
                        <input type={'checkbox'} className={'checkbox-audio-form'}
                               id={'sound-active-rightbar-checkbox'} checked={checked}
                               onChange={() => {
                                   props.soundActiveRightbarCheck(!checked);
                                   scene_utils.setProperty(scene, 'isAudioOn',!checked, props);
                               }}
                        />
                        <label htmlFor={'sound-active-rightbar-checkbox'}>Riproduci l'audio del file</label>
                    </div>
                </div>
                <label className={'rightbar-titles'}>Audio spaziali</label>
                {spatialAudioList(props, scene)}
                <label className={'rightbar-titles'}>Musica di sottofondo</label>
                <Dropdown
                    props={props}
                    component={'music'}
                    property={'music'}
                    defaultValue={scene.music}
                />
                <label className={'rightbar-titles'}>Effetti sonori d'ambiente</label>
                <Dropdown
                    props={props}
                    component={'sfx'}
                    property={'sfx'}
                    defaultValue={scene.sfx}
                />
            </div>
        );
    } else {
        return(
            <div>Nessuna scena selezionata</div>
        );
    }
}


/**
 * Generates spatial audio list
 * @param props
 * @param scene
 * @returns {*}
 */
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
                    disabled={props.editor.audioToEdit == null}
                    onClick={() => {
                        props.isItNew(false);
                    }}
                >
                    <img className={"action-buttons"} src={"icons/icons8-pencil-50.png"} alt={'Modifica'}/>
                </button>
                <button
                    title={"Cancella audio"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        props.removeAudio(props.editor.audioToEdit);
                    }}
                    disabled={props.editor.audioToEdit == null}
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

function checkSelection(props, uuid){
    if(props.editor.audioToEdit && props.editor.audioToEdit.uuid === uuid){
        return 'selected-audio';
    }
    return '';
}


function checkAndRemoveScene(props, scene){
    let answer = window.confirm('Vuoi rimuovere la scena? Verranno rimossi tutti gli oggetti, regole e audio ad essa collegati.');
    if(answer){
        props.removeScene(scene);
    }
}

export default SceneOptions;