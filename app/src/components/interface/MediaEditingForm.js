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
                                <h5 className="modal-title" id="edit-media-modal-label">Modifica i media</h5>
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
                        <label htmlFor={"media-off-to-on"} className={'box-titles'}>Da OFF a ON</label>
                        <div className={'selected-medias-and-masks media-grid'}>
                            <p className={'file-selected-name propertyForm'}>
                                {object.media.media0 ? object.media.media0 : "Nessun file selezionato"}
                            </p>
                            {buttonFileSelection(props, "media0")}
                            {buttonRemoveFile(object, 'media0', props)}
                        </div>

                    </div>
                    <div id={'uploadMedia-on-to-off'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media-on-to-off"} className={'box-titles'}>Da ON a OFF</label>
                        <div className={'selected-medias-and-masks media-grid'}>
                            <p className={'file-selected-name propertyForm'}>
                                {object.media.media1 ? object.media.media1 : "Nessun file selezionato"}
                            </p>
                            {buttonFileSelection(props, "media1")}
                            {buttonRemoveFile(object, 'media1', props)}
                        </div>
                    </div>
                    <div id={'uploadMask'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask"} className={'box-titles'}>Maschera</label>
                        <div className={'selected-medias-and-masks media-grid'}>
                            <p className={'file-selected-name propertyForm'}>
                                {object.mask ? object.mask : "Nessun file selezionato"}
                            </p>
                            {buttonFileSelection(props, "mask")}
                            {buttonRemoveFile(object, 'mask', props)}
                        </div>
                    </div>
                </div>
            );
        default:
            return(
                <div>
                    <div id={'uploadMedia'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"media"} className={'box-titles'}>Media</label>
                        <div className={'selected-medias-and-masks media-grid'}>
                            <p className={'file-selected-name propertyForm'}>
                                {object.media.media0 ? object.media.media0 : "Nessun file selezionato"}
                            </p>
                            {buttonFileSelection(props, "media0")}
                            {buttonRemoveFile(object, 'media0', props)}
                        </div>
                    </div>
                    <div id={'uploadMask'}
                         className={'media-editing-divs'}
                    >
                        <label htmlFor={"mask"} className={'box-titles'}>Maschera</label>
                        <div className={'selected-medias-and-masks media-grid'}>
                            <p className={'file-selected-name propertyForm'}>
                                {object.mask ? object.mask : "Nessun file selezionato"}
                            </p>
                            {buttonFileSelection(props, "mask")}
                            {buttonRemoveFile(object, 'mask', props)}
                        </div>
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
            className={"btn-img"}
            onClick={()=> interface_utils.setPropertyFromValue(object, property, null, props)}
        >
            <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Rimuovi file'}/>
        </button>
    );
}


export default MediaEditingform;