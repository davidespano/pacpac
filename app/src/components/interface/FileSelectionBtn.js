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
                onClick={() => props.selectMediaToEdit(component)}
        >
            <img className={"action-buttons btn-img"} src={"icons/icons8-add-folder-50.png"}/>
            {component === 'rightbar' ? '' : 'Cerca'}
        </button>
    );
}

export default FileSelectionBtn;