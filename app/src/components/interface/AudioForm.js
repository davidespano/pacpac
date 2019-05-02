import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import Tag from "../../scene/Tag";
import FileSelectionBtn from "./FileSelectionBtn";
let uuid = require('uuid');

function AudioForm(props){
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
                            <div id={'audio-form-box'}>
                                {generalOptions(props)}
                                {playOption(props)}
                            </div>
                        </div>
                        <div className="modal-footer" id={'modal-footer-media'}>
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    data-dismiss="modal" >Salva</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function generalOptions(props){
    let properties = {
        props : props,
        component : 'audio-form',
    };
    return(
        <div id={'audio-form-general'} className={'audio-form-box-section'}>
            <div className={'audio-form-box-titles'}>Generali</div>
            <div className={'audio-form-box-grid'}>
                <input id={'input-name-audio'} className={'input-audio-form'} type={'text'}/>
                <div> </div>
                <input id={'input-scene-audio'} className={'input-audio-form'} type={'text'}/>
                <div>
                    <input type={'checkbox'} id={'local-checkbox'}/>
                    <label htmlFor={'local-checkbox'}>Locale</label>
                </div>
                <div id={'select-file-audio'}>
                    <p id={'file-selected-name'}
                       className={'input-new-audio-file'}
                    >
                        {selectedFile(props)}
                    </p>
                </div>
                <div>
                    <FileSelectionBtn {...properties} />
                    <input type={'checkbox'} id={'multichannel-checkbox'}/>
                    <label htmlFor={'multichannel-checkbox'}>Multicanale</label>
                </div>
            </div>
        </div>
    );
}

function playOption(props){
    return(
        <div id={'audio-form-play'} className={'audio-form-box-section'}>
            <div className={'audio-form-box-titles'}>Riproduzione</div>
            <input type={'checkbox'}/> Loop
        </div>
    );
}

function selectedFile(props){
    return props.editor.selectedFile ? props.editor.selectedFile : 'No file selected';
}

function title(editor){
    return editor.selectedAudioToEdit ? 'Modifica audio' : 'Nuovo audio';
}

export default AudioForm;