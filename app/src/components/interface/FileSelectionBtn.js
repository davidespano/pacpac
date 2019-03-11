import React from 'react';

function FileSelectionBtn(properties){

    let props = properties.props,
        component = properties.component;

    return(
        <button name={'image'}
                id={'select-file-btn-' + component}
                className={'select-file-btn btn'}
                data-toggle="modal"
                data-target="#add-file-modal"
                onClick={() => props.selectMediaToEdit(component)}
        >
            <img className={"action-buttons"} src={"icons/icons8-add-folder-50.png"}/>
            Cerca
        </button>
    );
}

export default FileSelectionBtn;