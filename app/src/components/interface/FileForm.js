import React from 'react';
import FileContainer from "./FileContainer";
import scene_utils from "../../scene/scene_utils";
import interface_utils from "./interface_utils";

function FileForm(props){
    let properties = {
        props : props,
        component : 'modal',
    };

    let buttonStatus = !props.editor.selectedFile;

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
                                disabled={buttonStatus}
                                onClick={()=> handleFileUpdate(props)}
                            >
                                Open file
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function handleFileUpdate(props){
    switch(props.editor.selectedMediaToEdit){
        case 'mask':
        case 'media0':
        case 'media1':
            let obj = props.interactiveObjects.get(props.currentObject);
            interface_utils.setPropertyFromValue(obj, props.editor.selectedMediaToEdit, props.editor.selectedFile, props);
            break;
        case 'rightbar':
            let scene = props.scenes.get(props.currentScene);
            scene_utils.setProperty(scene, 'img', props.editor.selectedFile, props, props.editor.scenesOrder);
            break;
    }
}

export default FileForm;