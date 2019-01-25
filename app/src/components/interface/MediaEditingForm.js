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
                    <div id={'uploadMedia-on-to-off'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media-on-to-off"}>Media ON to OFF</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.media.onToOff ? object.media.onToOff : "No file selected"}
                            {buttonRemoveFile(object, 'media-on-to-off', props)}
                        </div>
                        {buttonFileSelection(props, "media-on-to-off")}
                    </div>
                    <div id={'uploadMask-on-to-off'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask-on-to-off"}>Mask ON to OFF</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.mask.onToOff ? object.mask.onToOff : "No file selected"}
                            {buttonRemoveFile(object, 'mask-on-to-off', props)}
                        </div>
                        {buttonFileSelection(props, "mask-on-to-off")}
                    </div>
                    <div id={'uploadMedia-off-to-on'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media-off-to-on"}>Media OFF to ON</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.media.offToOn ? object.media.offToOn : "No file selected"}
                            {buttonRemoveFile(object, 'media-off-to-on', props)}
                        </div>
                        {buttonFileSelection(props, "media-off-to-on")}
                    </div>
                    <div id={'uploadMask-off-to-on'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask-off-to-on"}>Mask OFF to ON</label>
                        <div className={'selected-medias-and-masks'}>
                            {object.mask.offToOn ? object.mask.offToOn : "No file selected"}
                            {buttonRemoveFile(object, 'mask-off-to-on', props)}
                        </div>
                        {buttonFileSelection(props, "mask-off-to-on")}
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
                            {object.media ? object.media : "No file selected"}
                            {buttonRemoveFile(object, 'media', props)}
                        </div>
                        {buttonFileSelection(props, "media")}
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
            <img className={"action-buttons"} src={"icons/icons8-delete-filled-50.png"} alt={'Remove file'}/>
        </button>
    );
}


export default MediaEditingform;