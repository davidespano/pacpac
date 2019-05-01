import React from 'react';
let uuid = require('uuid');

function AudioMenu(props){
    return(
        <div id={"manage-audio"}>
            <div className="modal fade" id="manage-audio-modal" tabIndex="-1" role="dialog" aria-labelledby="manage-audio-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id={'modal-content-audio'}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="manage-audio-modal-label">Gestione audio</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions" id={'modal-body-audio'}>
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
                                        return audio.name;
                                    }
                                })}
                            </div>
                            <div id={'audio-buttons-box'}>
                                <button id={'new-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                        data-toggle="modal"
                                        data-target="#audio-form-modal"
                                >
                                    Nuovo oggetto audio
                                </button>
                                <button id={'edit-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                >
                                    <img className={"action-buttons"} src={"icons/icons8-pencil-50.png"}/>
                                    Modifica oggetto
                                </button>
                                <button id={'remove-audio-btn'}
                                        className={'btn audio-btn btn-secondary'}
                                >
                                    <img className={"action-buttons"} src={"icons/icons8-white-waste-50.png"}/>
                                    Cancella oggetto
                                </button>
                            </div>

                        </div>
                        <div className="modal-footer" id={'modal-footer-media'}>
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    data-dismiss="modal" >Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AudioMenu;