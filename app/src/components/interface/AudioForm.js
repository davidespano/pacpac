import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import Tag from "../../scene/Tag";
import FileSelectionBtn from "./FileSelectionBtn";
import Audio from "../../audio/Audio";
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
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions" id={'modal-body-audio-form'}>
                            <form id={'audio-form-box'}>
                                {generalOptions(props, audioToEdit)}
                                {sceneOption(props, audioToEdit)}
                                {playOption(props, audioToEdit)}
                            </form>
                        </div>
                        <div className="modal-footer" id={'modal-footer-media'}>
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    data-dismiss="modal"
                                    onClick={() => {
                                        audioToEdit ? editAudio(props, audioToEdit) : saveNewAudio(props);
                                        resetFields();
                                    }}
                            >Salva</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function generalOptions(props, audioToEdit){
    let properties = {
        props : props,
        component : 'audio-form',
    };
    let name = audioToEdit ? audioToEdit.name : null;

    return(
        <div id={'audio-form-general'} className={'audio-form-box-section'}>
            <div className={'audio-form-box-titles'}>Generali</div>
            <div className={'audio-form-box-grid'}>
                <input id={'input-name-audio'} className={'input-audio-form'} type={'text'} placeholder={'Nome'} defaultValue={name}/>
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

function sceneOption(props){
    let local = props.editor.isAudioLocal;

    return(
        <div id={'audio-form-scene'} className={'audio-form-box-section'}>
            <div className={'audio-form-box-titles'}>Appartenenza</div>
            <div className={'audio-form-box-grid'}>
                <form>
                    <input type={'radio'} name={'isLocal'} id={'local-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioLocalOptionStatus(true)}
                           defaultChecked={local}
                    />
                    <label htmlFor={'local-radio'} className={'label-audio-form'}>Scena</label>
                    <input type={'radio'} name={'isLocal'} id={'global-radio'} className={'radio-audio-form'}
                           onClick={()=> props.changeAudioLocalOptionStatus(false)}
                           defaultChecked={!local}
                    />
                    <label htmlFor={'local-radio'} className={'label-audio-form'}>Progetto</label>
                </form>
                <div> </div>
                <select id={'input-scene-audio'} className={'input-audio-form'}
                        disabled={!local}>
                    {[...props.scenes.values()].map(scene =>
                        <option>{scene.name}</option>)}
                </select>
            </div>
        </div>
    );
}


function playOption(props, audioToEdit){
    let checked = audioToEdit ? audioToEdit.loop : false;

    return(
        <div id={'audio-form-play'} className={'audio-form-box-section'}>
            <div className={'audio-form-box-titles'}>Riproduzione</div>
            <input type={'checkbox'} className={'checkbox-audio-form'} id={'loop-checkbox'}/>
            <label htmlFor={'loop-checkbox'} className={'label-audio-form'} defaultChecked={checked}>Loop</label>
        </div>
    );
}



function saveNewAudio(props){
    console.log('salvaa')
    let name = document.getElementById('input-name-audio').value,
        file = props.editor.selectedFile,
        isLocal = props.editor.isAudioLocal,
        loop = document.getElementById('loop-checkbox').value == 'on' ? true : false;

    let e = document.getElementById('input-scene-audio');
    let scene = e.options[e.selectedIndex].value;


    props.addNewAudio(Audio({
        uuid: uuid.v4(),
        name: name,
        file: file,
        isLocal: isLocal,
        scene: isLocal ? scene : null,
        loop: loop,
    }))

}

function editAudio(props, audioToEdit){
    let name = document.getElementById('input-name-audio').value,
        file = document.getElementById('file-selected-name').innerText,
        isLocal = props.editor.isAudioLocal,
        loop = document.getElementById('loop-checkbox').value == 'on' ? true : false;

    let e = document.getElementById('input-scene-audio');
    let scene = e.options[e.selectedIndex].value;


    props.updateAudio(Audio({
        uuid: audioToEdit.uuid,
        name: name,
        file: file,
        isLocal: isLocal,
        scene: isLocal ? scene : null,
        loop: loop,
    }))
}

function selectedFile(props, audioToEdit){
    console.log(props.editor.selectedFile)
    if(audioToEdit){
        return audioToEdit.file ? audioToEdit.file : 'No file selected';
    }
    return props.editor.selectedFile ? props.editor.selectedFile : 'No file selected';
}

function title(editor){
    return editor.selectedAudioToEdit ? 'Modifica audio' : 'Nuovo audio';
}

function resetFields(){
    document.getElementById('audio-form-box').reset();
}

export default AudioForm;