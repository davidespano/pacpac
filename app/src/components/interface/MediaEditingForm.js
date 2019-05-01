import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import FileSelectionBtn from "./FileSelectionBtn";
import interface_utils from "./interface_utils";

function MediaEditingform(props){

    if(props.currentObject){
        let object = props.interactiveObjects.get(props.currentObject);

        return(
            <div id={"edit-media"}>
                <div className="modal fade" id="edit-media-modal" tabIndex="-1" role="dialog" aria-labelledby="edit-media-modal-label" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="edit-media-modal-label">Edit media</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body modalOptions">
                                {generateMediaModal(props, object)}
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

    return null;
}

function generateMediaModal(props, object){

    switch(object.type){
        case InteractiveObjectsTypes.SWITCH:
            return(
                <div>
                    <div id={'uploadMedia-off-to-on'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media-off-to-on"}>Media OFF to ON</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.media.media0 ? object.media.media0 : "No file selected"}
                            {buttonRemoveFile(object, 'media0', props)}
                        </div>
                        {buttonFileSelection(props, "media0")}
                    </div>
                    <div id={'uploadMedia-on-to-off'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media-on-to-off"}>Media ON to OFF</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.media.media1 ? object.media.media1 : "No file selected"}
                            {buttonRemoveFile(object, 'media1', props)}
                        </div>
                        {buttonFileSelection(props, "media1")}
                    </div>
                    <div id={'uploadMask'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask"}>Mask</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.mask ? object.mask : "No file selected"}
                            {buttonRemoveFile(object, 'mask', props)}
                        </div>
                        {buttonFileSelection(props, "mask")}
                    </div>
                </div>
            );
        default:
            return(
                <div>
                    <div id={'uploadMedia'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media"}>Media</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.media.media0 ? object.media.media0 : "Nessun file selezionato"}
                            {buttonRemoveFile(object, 'media0', props)}
                        </div>
                        {buttonFileSelection(props, "media0")}
                    </div>
                    <div id={'uploadMask'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask"}>Mask</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.mask ? object.mask : "Nessun file selezionato"}
                            {buttonRemoveFile(object, 'mask', props)}
                        </div>
                        {buttonFileSelection(props, "mask")}
                    </div>
                </div>
            );
    }
}

function buttonFileSelection(props, component){
    let properties = {
        props : props,
        component : component,
    };

    return <FileSelectionBtn {...properties}/>
}

function buttonRemoveFile(object, property, props){
    return(
        <button
            title={"Remove file"}
            className={""}
            onClick={()=> interface_utils.setPropertyFromValue(object, property, null, props)}
        >
            <img className={"action-buttons"} src={"icons/icons8-delete-filled-50.png"} alt={'Rimuovi file'}/>
        </button>
    );
}


export default MediaEditingform;