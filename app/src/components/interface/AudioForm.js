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
                            <button type="button" className="close" data-dismiss="modal"
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
                                        interface_utils.resetFields('audio-form-modal');
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
                       className={'input-new-audio-file'}
                    >
                        {selectedFile(props, audioToEdit)}
                    </p>
                </div>
                <FileSelectionBtn {...properties} />
            </div>
        </div>
    );
}

function spatialOption(props){
    let spatial = props.editor.isAudioSpatial;

    return(
        <div id={'audio-form-scene'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Opzioni</div>
            <div className={'box-grid'}>
                <form>
                    <input type={'radio'} name={'isSpatial'} id={'spatial-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioSpatialOptionStatus(true)}
                           defaultChecked={spatial}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Spaziale</label>
                    <input type={'radio'} name={'isSpatial'} id={'global-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioSpatialOptionStatus(false)}
                           defaultChecked={!spatial}
                    />
                    <label htmlFor={'spatial-radio'} className={'label-audio-form'}>Non spaziale</label>
                </form>
                <div> </div>
                <Dropdown props={props} component={'scenes'} defaultValue={props.currentScene} disabled={!spatial}/>
                <button className={'btn position-btn'} disabled={!spatial}>
                    <img className={"action-buttons btn-img"} src={"icons/icons8-white-image-50.png"}/>
                    Posiziona
                </button>
            </div>
        </div>
    );
}


function playOption(props, audioToEdit){
    let checked = audioToEdit ? audioToEdit.loop : false;

    return(
        <div id={'audio-form-play'} className={'audio-form-box-section'}>
            <div className={'box-titles'}>Riproduzione</div>
            <input type={'checkbox'} className={'checkbox-audio-form'} id={'loop-checkbox'}/>
            <label htmlFor={'loop-checkbox'} className={'label-audio-form'} defaultChecked={checked}>Loop</label>
        </div>
    );
}



function saveNewAudio(props){
    let name = document.getElementById('input-name-audio').value,
        file = props.editor.selectedAudioFile,
        isSpatial = props.editor.isAudioSpatial,
        loop = document.getElementById('loop-checkbox').value == 'on' ? true : false,
        scene = props.selectedSceneSpatialAudio;

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
        file = document.getElementById('file-selected-name').innerText,
        isSpatial = props.editor.isAudioSpatial,
        loop = document.getElementById('loop-checkbox').value == 'on' ? true : false;

    let e = document.getElementById('input-scene-audio');
    let scene = e.options[e.selectedIndex].value;

    props.updateAudio(Audio({
        uuid: audioToEdit.uuid,
        name: name,
        file: file,
        isSpatial: isSpatial,
        scene: isSpatial ? scene : null,
        loop: loop,
    }));

    console.log(audioToEdit)

    if(!isSpatial && audioToEdit.isSpatial){
        console.log('da spaziale a non spaziale')
        scene = props.scenes.get(audioToEdit.scene);
        scene = scene_utils.removeAudioFromScene(scene, audioToEdit.uuid);
        props.updateScene(scene);
        console.log(scene)
    }

    if(isSpatial && !audioToEdit.isSpatial){
        console.log('da non spaziale a spaziale')
        scene = props.scenes.get(scene);
        scene = scene_utils.addAudioToScene(scene, audioToEdit.uuid);
        props.updateScene(scene);
        console.log(scene)
    }
}

function selectedFile(props, audioToEdit){
    if(audioToEdit){
        return audioToEdit.file ? audioToEdit.file : 'Nessun file selezionato';
    }
    return props.editor.selectedAudioFile ? props.editor.selectedAudioFile : 'Nessun file selezionato';
}

function title(editor){
    return editor.selectedAudioToEdit ? 'Modifica audio' : 'Nuovo audio';
}

export default AudioForm;