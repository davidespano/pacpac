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

    let audioToEdit = props.editor.selectedAudioToEdit ? props.audios.get(props.editor.selectedAudioToEdit) : null;

    return(
        <div id={"audio-form"}>
            <div className="modal fade" id="audio-form-modal" tabIndex="-1" role="dialog" aria-labelledby="audio-form-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id={'modal-content-audio'}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="audio-form-modal-label">{title(props.editor)}</h5>
                            <button id="audio-form-close-button" type="button" className="close" data-dismiss="modal"
                                    aria-label="Close" onClick={() => {
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
                                        audioToEdit ? editAudio(props, audioToEdit) : saveNewAudio(props);
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
    return audioToEdit ? false : !(props.editor.selectedAudioFile && props.editor.newAudioNameTyped);
}

function generalOptions(props, audioToEdit){
    let properties = {
        props : props,
        component : 'audio-form',
    };
    let name = audioToEdit ? audioToEdit.name : null;

    return(
        <div id={'audio-form-general'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Generali</div>
            <div className={'box-grid'}>
                <input id={'input-name-audio'} className={'input-audio-form'}
                       type={'text'} placeholder={'Nome'} defaultValue={name}
                       onChange={() => {
                           let name = document.getElementById("input-name-audio").value;
                           props.newAudioNameTyped(name != "");
                       }}/>
                <div> </div>
                <div id={'select-file-audio'}>
                    <p id={'file-selected-name'}
                       className={'input-new-audio-file ellipsis-no-inline'}
                    >
                        {selectedFile(props)}
                    </p>
                </div>
                <FileSelectionBtn {...properties} />
            </div>
        </div>
    );
}

function spatialOption(props, audioToEdit){

    let spatial = props.editor.isAudioSpatial;
    let selectedScene = props.editor.selectedSceneSpatialAudio;

    return(
        <div id={'audio-form-scene'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Opzioni</div>
            <div className={'box-grid'}>
                <div>
                    <input type={'radio'} name={'isSpatial'} id={'spatial-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioSpatialOptionStatus(true)}
                           checked={spatial}
                           onChange={()=>{}}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Spaziale</label>
                    <input type={'radio'} name={'isSpatial'} id={'global-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioSpatialOptionStatus(false)}
                           checked={!spatial}
                           onChange={()=>{}}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Non spaziale</label>
                </div>
                <div> </div>
                <Dropdown props={props}
                          component={'scenes'}
                          property={'scene'}
                          defaultValue={selectedScene ? selectedScene : props.currentScene}
                          disabled={!spatial}/>
                <button className={'btn position-btn'} disabled={!spatial}
                        onClick={() => {
                            //document.getElementById('audio-form-close-button').click();
                            //document.getElementById('audio-menu-close-button').click();
                            props.switchToGeometryMode()
                        }}>
                    <img className={"action-buttons"} src={"icons/icons8-white-image-50.png"}/>
                    Posiziona
                </button>
            </div>
        </div>
    );
}


function playOption(props){
    let checked = props.editor.loopChecked;
    return(
        <div id={'audio-form-play'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Riproduzione</div>
            <input type={'checkbox'} className={'checkbox-audio-form'}
                   id={'loop-checkbox'} checked={checked}
                   onChange={() => props.loopCheck(!checked)}
            />
            <label htmlFor={'loop-checkbox'} className={'label-audio-form'}>Loop</label>
        </div>
    );
}



function saveNewAudio(props){
    let name = document.getElementById('input-name-audio').value,
        file = props.editor.selectedAudioFile,
        isSpatial = props.editor.isAudioSpatial,
        loop = document.getElementById('loop-checkbox').value == 'on' ? true : false,
        scene = props.editor.selectedSceneSpatialAudio;

    console.log(props.editor.selectedSceneSpatialAudio);
    props.addNewAudio(Audio({
        uuid: uuid.v4(),
        name: name,
        file: file,
        isSpatial: isSpatial,
        scene: isSpatial ? scene : null,
        loop: loop,
    }))

}

function editAudio(props, audioToEdit){
    let name = document.getElementById('input-name-audio').value,
        file = props.editor.selectedAudioFile,
        isSpatial = props.editor.isAudioSpatial,
        loop = props.editor.loopChecked,
        scene = props.editor.selectedSceneSpatialAudio;

    console.log(props.editor.selectedSceneSpatialAudio);


    file = file === 'Nessun file selezionato' ? null : file;

    props.updateAudio(Audio({
        uuid: audioToEdit.uuid,
        name: name,
        file: file,
        isSpatial: isSpatial,
        scene: isSpatial ? scene : null,
        loop: loop,
    }));

    //from spatial to non spatial
    if(!isSpatial && audioToEdit.isSpatial){
        scene = props.scenes.get(audioToEdit.scene);
        scene = scene_utils.removeAudioFromScene(scene, audioToEdit.uuid);
        props.updateScene(scene);
    }
    //from non spatial to spatial
    if(isSpatial && !audioToEdit.isSpatial){
        scene = props.scenes.get(scene);
        scene = scene_utils.addAudioToScene(scene, audioToEdit.uuid);
        props.updateScene(scene);
    }
}

function selectedFile(props){
    return props.editor.selectedAudioFile ? props.editor.selectedAudioFile : 'Nessun file selezionato';
}

function title(editor){
    return editor.selectedAudioToEdit ? 'Modifica audio' : 'Nuovo audio';
}

export default AudioForm;