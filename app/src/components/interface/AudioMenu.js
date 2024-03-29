import React from 'react';
import interface_utils from "./interface_utils";
let uuid = require('uuid');

function AudioMenu(props){
    return(
        <div id={"manage-audio"}>
            <div className={"modal fade " + show(props)} id="manage-audio-modal" tabIndex="-1" role="dialog" aria-labelledby="manage-audio-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id={'modal-content-audio'}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="manage-audio-modal-label">Gestione audio</h5>
                            <button id="audio-menu-close-button" type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => {
                                        props.selectAudioToEdit(null);
                                    }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions" id={'modal-body-audio'}>
                            <div>
                                <input type={'text'} id={'audio-search'}
                                       className={'audio-inputs'}
                                       placeholder={"Filtra..."}
                                       onChange={() => {
                                           let value = document.getElementById('audio-search').value;
                                           props.updateAudioFilter(value);
                                       }}/>
                                <div id={'audio-box'}>
                                    {[...props.audios.values()].map(audio => {
                                        if(audio.name.includes(props.editor.audioFilter)){
                                            return (
                                                <p className={'audio-names ' + checkSelection(props, audio.uuid)}
                                                   key={audio.uuid}
                                                   onClick={()=> interface_utils.audioSelection(props, audio)}>
                                                    {audio.name}
                                                </p>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div id={'audio-buttons-box'}>
                                <button id={'new-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                        data-toggle="modal"
                                        data-target="#audio-form-modal"
                                        data-backdrop="false"
                                        onClick={() => {
                                            props.selectAudioToEdit(null);
                                            props.isItNew(true);
                                        }}
                                >
                                    Nuovo oggetto audio
                                </button>
                                <button id={'edit-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                        data-toggle="modal"
                                        data-target="#audio-form-modal"
                                        data-backdrop="false"
                                        disabled={props.editor.audioToEdit == null}
                                        onClick={() => {
                                            props.isItNew(false);
                                        }}
                                >
                                    <img className={"action-buttons btn-img"} src={"icons/icons8-white-pencil-50.png"}/>
                                    Modifica oggetto
                                </button>
                                <button id={'remove-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                        disabled={props.editor.audioToEdit == null}
                                        onClick={() => {
                                            props.removeAudio(props.editor.audioToEdit);
                                        }}
                                >
                                    <img className={"action-buttons btn-img"} src={"icons/icons8-white-waste-50.png"}/>
                                    Cancella oggetto
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer" id={'modal-footer-media'}>
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    data-dismiss="modal" onClick={() => {
                                        props.selectAudioToEdit(null);
                                    }}
                            >Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function checkSelection(props, uuid){
    return (props.editor.audioToEdit && props.editor.audioToEdit.uuid === uuid) ? 'selected-audio' : '';
}

function show(props){
    return props.editor.audioPositioning ? "show" : "";
}

export default AudioMenu;