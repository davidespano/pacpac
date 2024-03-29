import React from 'react';
import FileContainer from "./FileContainer";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";

function FileForm(props){
    let properties = {
        props : props,
        component : 'modal',
    };

    let disabled = !props.editor.selectedFile;

    return(
        <div id={"manage-files"}>
            <div className="modal fade" id="add-file-modal" tabIndex="-1" role="dialog" aria-labelledby="add-file-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-file-modal-label">Choose file</h5>
                            <button id={'manage-files-close-btn'} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <FileContainer {...properties}/>
                            <button
                                id={'button-file-selectiom'}
                                type={'button'}
                                className={'btn'}
                                data-dismiss="modal"
                                disabled={disabled}
                                onClick={()=> interface_utils.handleFileUpdate(props)}
                            >
                                Apri
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default FileForm;