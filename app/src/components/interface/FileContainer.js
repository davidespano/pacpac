import React from 'react';
import settings from '../../utils/settings';
import ReactDOM from 'react-dom';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '../../filemanager/connector-node-v1';
import interface_utils from "./interface_utils";

const {apiBaseURL} = settings;

const apiOptions = {
    ...connectorNodeV1.apiOptions,
    locale: "it",
    apiRoot: apiBaseURL + '/filemanager/' + window.localStorage.getItem("gameID") // Or you local Server Node V1 installation.
};

function FileContainer(properties){

    let props = properties.props,
        component = properties.component;

    /**TODO: disabilitare selezione multipla se il component è modal**/

    return (
        <div className={"filemanager"}>
            <FileManager>
                <FileNavigator
                    id={"filemanager-" + component}
                    api={connectorNodeV1.api}
                    apiOptions={apiOptions}
                    capabilities={connectorNodeV1.capabilities}
                    listViewLayout={connectorNodeV1.listViewLayout}
                    viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
                    onResourceItemClick={
                        ({ event, number, rowData }) => handleFileSelection(props, rowData, component)
                    }
                    onResourceItemDoubleClick={
                        ({ event, number, rowData }) => handleDoubleClick(props, rowData, component)
                    }
                />
            </FileManager>
        </div>
    );
}

function handleFileSelection(props, data, component){
    if(component === 'modal'){
        if(data.type !== 'dir'){
            let path = "";
            for(let i = 1; i < data.ancestors.length; i++){
                path += data.ancestors[i].name + "/";
            }

            path += data.name;
            props.selectFile(path);

            if(props.editor.selectedMediaToEdit !== 'topbar' && props.editor.selectedMediaToEdit !== 'audio-form'){
                let obj = props.interactiveObjects.get(props.currentObject);
                interface_utils.setPropertyFromValue(obj, props.editor.selectedMediaToEdit, path, props);
            }
        }
    }
}

function handleDoubleClick(props, data, component) {
    if(component === 'modal' && data.type === 'file') {
        handleFileSelection(props, data, component);
        document.getElementById('manage-files-close-btn').click();
    }
}

export default FileContainer;