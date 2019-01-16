import React from 'react';
import settings from '../../utils/settings';
import ReactDOM from 'react-dom';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '../../filemanager/connector-node-v1';

const {apiBaseURL} = settings;

const apiOptions = {
    ...connectorNodeV1.apiOptions,
    locale: "en",
    apiRoot: apiBaseURL + '/filemanager/' + window.localStorage.getItem("gameID") // Or you local Server Node V1 installation.
}

function FileContainer(props){
    return(
        <div className={"filemanager"}>
            <FileManager>
                <FileNavigator
                    id="filemanager-1"
                    api={connectorNodeV1.api}
                    apiOptions={apiOptions}
                    capabilities={connectorNodeV1.capabilities}
                    listViewLayout={connectorNodeV1.listViewLayout}
                    viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
                />
            </FileManager>
        </div>
    );
}

export default FileContainer;