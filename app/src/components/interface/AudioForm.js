import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import Tag from "../../scene/Tag";
import FileSelectionBtn from "./FileSelectionBtn";
import Audio from "../../audio/Audio";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";
import Dropdown from "./Dropdown";
let uuid = require('uuid');

function AudioForm(props){

    let audioToEdit = props.editor.audioToEdit ?
        props.editor.audioToEdit :
        Audio({
            uuid: uuid.v4(),
        });

    return(
        <div id={"audio-form"}>
            <div className={"modal fade " + show(props)} id="audio-form-modal" tabIndex="-1" role="dialog" aria-labelledby="audio-form-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id={'modal-content-audio'}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="audio-form-modal-label">{title(props.editor.isItNew)}</h5>
                            <button id="audio-form-close-button" type="button" className="close" data-dismiss="modal"
                                    aria-label="Close" onClick={() => {
                                        props.selectAudioToEdit(null);
                                        props.audioPositioning(false);
                                        interface_utils.resetFields('audio-form-box');
                                    }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions" id={'modal-body-audio-form'}>
                            <form id={'audio-form-box'}>
                                {generalOptions(props, audioToEdit)}
                                {spatialOption(props, audioToEdit)}
                                {playOption(props, audioToEdit)}
                            </form>
                        </div>
                        <div className="modal-footer" id={'modal-footer-media'}>
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    data-dismiss="modal"
                                    onClick={() => {
                                        saveAudio(props, audioToEdit);
                                        props.audioPositioning(false);
                                        interface_utils.resetFields('audio-form-box');
                                    }}
                                    disabled={checkIfDisabled(props, audioToEdit)}
                            >Salva</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function checkIfDisabled(props, audioToEdit) {
    return !(audioToEdit.file && audioToEdit.name);
}

function generalOptions(props, audioToEdit){
    let properties = {
        props : props,
        component : 'audio-form',
        audioToEdit: audioToEdit,
    };

    return(
        <div id={'audio-form-general'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Generali</div>
            <div className={'box-grid'}>
                <input id={'input-name-audio'} className={'input-audio-form'}
                       type={'text'} placeholder={'Nome'} defaultValue={audioToEdit.name}
                       onChange={() => {
                           let name = document.getElementById("input-name-audio").value;
                           let newAudio = audioToEdit.set('name', name);
                           props.selectAudioToEdit(newAudio);
                       }}/>
                <div></div>
                <div id={'select-file-audio'}>
                    <p id={'file-selected-name'}
                       className={'input-new-audio-file ellipsis-no-inline'}
                    >
                        {selectedFile(audioToEdit)}
                    </p>
                </div>
                <FileSelectionBtn {...properties} />
            </div>
        </div>
    );
}

function spatialOption(props, audioToEdit){

    let spatial = audioToEdit.isSpatial;
    let disabled = !(audioToEdit.file && audioToEdit.name && spatial && audioToEdit.scene);

    return(
        <div id={'audio-form-scene'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Opzioni</div>
            <div className={'box-grid'}>
                <div>
                    <input type={'radio'} name={'isSpatial'} id={'spatial-radio'} className={'radio-audio-form'}
                           onClick={()=> {
                               let newAudio = audioToEdit.set('isSpatial', true);
                               if(!audioToEdit.scene){
                                   newAudio = newAudio.set('scene', props.currentScene);
                               }
                               props.selectAudioToEdit(newAudio);
                           }}
                           checked={spatial}
                           onChange={()=>{}}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Spaziale</label>
                    <input type={'radio'} name={'isSpatial'} id={'global-radio'} className={'radio-audio-form'}
                           onClick={()=> {
                               let newAudio = audioToEdit.set('isSpatial', false);
                               props.selectAudioToEdit(newAudio);
                           }}
                           checked={!spatial}
                           onChange={()=>{}}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Non spaziale</label>
                </div>
                <div> </div>
                <div> Posizione corrente: {getVertices(audioToEdit)}</div>
                <div> </div>
                <Dropdown props={props}
                          component={'scenes'}
                          property={'scene'}
                          defaultValue={audioToEdit.scene}
                          disabled={!spatial}/>
                <button className={'btn position-btn'} disabled={disabled}
                        onClick={() => {
                            props.audioPositioning(true);
                            props.switchToGeometryMode();
                        }}>
                    <img className={"action-buttons"} src={"icons/icons8-white-image-50.png"}/>
                    Posiziona
                </button>
            </div>
        </div>
    );
}


function playOption(props, audioToEdit){
    let checked = audioToEdit.checked;
    return(
        <div id={'audio-form-play'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Volume</div>
            <div className={'box-grid'}>
                <input type="range"
                       min="0" max="100"
                       className={'slider'}
                       value={audioToEdit.volume}
                       id={'input-volume-audio'}
                       onChange={() => {
                           let vol = document.getElementById("input-volume-audio").value;
                           let newAudio = audioToEdit.set('volume', vol);
                           props.selectAudioToEdit(newAudio);
                       }}
                />
                <div>
                    {audioToEdit.volume}
                    <img src={'icons/icons8-audio-100.png'} className={'action-buttons'} alt={'immagine volume audio'}/>
                </div>
            </div>
            <div className={'box-titles'}>Riproduzione</div>
            <input type={'checkbox'} className={'checkbox-audio-form'}
                   id={'loop-checkbox'} checked={checked}
                   onChange={() => {
                       let newAudio = audioToEdit.set('loop', !checked);
                       props.selectAudioToEdit(newAudio);
                   }}
            />
            <label htmlFor={'loop-checkbox'} className={'label-audio-form'}>Loop</label>
        </div>
    );
}

function saveAudio(props, audioToEdit){

    if(!audioToEdit.isSpatial)
        audioToEdit = audioToEdit.set('scene', null);

    if(!props.audios.has(audioToEdit.uuid)){ // nuovo audio
        props.addNewAudio(audioToEdit);
    } else {

        let original = props.audios.get(audioToEdit.uuid);
        let scene = null;
        props.updateAudio(audioToEdit);

        //from spatial to non spatial
        if(original.isSpatial && !audioToEdit.isSpatial){
            scene = props.scenes.get(audioToEdit.scene);
            scene = scene_utils.removeAudioFromScene(scene, audioToEdit.uuid);
            props.updateScene(scene);
        }
        //from non spatial to spatial
        if(!original.isSpatial && audioToEdit.isSpatial){
            scene = props.scenes.get(audioToEdit.scene);
            scene = scene_utils.addAudioToScene(scene, audioToEdit.uuid);
            props.updateScene(scene);
        }

        //from one scene to another
        if(original.isSpatial && audioToEdit.isSpatial && original.scene !== audioToEdit.scene){
            let originalScene = props.scenes.get(original.scene);
            let newScene = props.scenes.get(audioToEdit.scene);
            originalScene = scene_utils.removeAudioFromScene(originalScene, original.uuid);
            newScene = scene_utils.addAudioToScene(newScene, audioToEdit.uuid);
            props.updateScene(originalScene);
            props.updateScene(newScene);
        }

        props.selectAudioToEdit(null);
        props.isItNew(false);
    }




}

function getVertices(audioToEdit){
    if(audioToEdit.isSpatial && audioToEdit.vertices){
        let coordinates = audioToEdit.vertices.split(" ").map(x => parseFloat(x).toFixed(2));
        return 'x = ' + coordinates[0] + ', y = ' + coordinates[1] + ', z = ' + coordinates[2];
    } else {
        return 'x = 0, y = 0, z = 0';
    }
}

function selectedFile(audioToEdit){
    if(!audioToEdit || !audioToEdit.file){
        return 'Nessun file selezionato';
    }
    return audioToEdit.file;
}

function title(isItNew){
    return isItNew ? 'Nuovo audio' : 'Modifica audio';
}

function show(props){
    return props.editor.audioPositioning ? "show" : "";
}

export default AudioForm;