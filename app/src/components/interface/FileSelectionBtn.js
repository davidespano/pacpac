import React from 'react';

function FileSelectionBtn(properties){

    let props = properties.props,
        component = properties.component;

    return(
        <button name={'image'}
                type={'button'}
                id={'select-file-btn-' + component}
                className={'select-file-btn btn'}
                data-toggle="modal"
                data-target="#add-file-modal"
                title={'Cerca un file'}
                onClick={() => {
                    props.selectMediaToEdit(component)
                    if(component === 'audio-form'){
                        props.selectAudioToEdit(properties.audioToEdit)
                    }
                }}
        >
            <img className={"action-buttons btn-img"} src={"icons/icons8-add-folder-50.png"}/>
            {component === 'rightbar' ? '' : 'Cerca'}
        </button>
    );
}

export default FileSelectionBtn;