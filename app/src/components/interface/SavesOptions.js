import React from 'react';
import Immutable from "immutable";
import DebugAPI from "../../utils/DebugAPI";
import interface_utils from "./interface_utils";
import settings from "../../utils/settings";
import InputSaveForm from "./InputSaveForm";


const {mediaURL} = settings;

function SavesOptions(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div>
            {listSaves(props, path)}
        </div>

    )
}


/**
 * Generates saves list
 * @param props
 * @param path
 * @returns {any[]}
 */
function listSaves(props, path) {
    let regex = RegExp('.*\.mp4$|.MOV$');

    return ([...props.scenes.values()].map(child => {
        let s;
        s = {border: '2px solid black'};

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img) ? ".png" : "");

        console.log("SavesOptions/debugSaves", props.editor.debugSaves);

        if(props.editor.debugSaves !== undefined && props.editor.debugSaves.get(child.uuid) !== undefined) {
            return (
                    <div key={child.name} className={'node_element'}>
                        <h6>Salvataggi: {child.name}</h6>
                        <img
                            src={src}
                            className={'list-saves-img'}
                            alt={child.name}
                            title={interface_utils.title(child.name, props.tags.get(child.tag.name))}
                            style={s}
                        />
                        <div>
                            {listSceneSaves(props, child.uuid)}
                        </div>
                    </div>
            );
        }
    }));
}

function listSceneSaves(props, sceneUuid) {
    if(props.editor.debugSaves.get(sceneUuid)) {
        let savesList = props.editor.debugSaves.get(sceneUuid).toArray();
        return savesList.map(save => {
            return (
                <div id={"saves-list" + save.saveName} key={save.saveName} className={"saves-list"} onClick={() => {
                    let load = document.getElementById("load-button" + save.saveName);
                    let list = document.getElementById("saves-list" + save.saveName);
                    
                    interface_utils.setClassStyle(".saves-list", "margin-right: -10%");
                    interface_utils.setClassStyle(".load-button", "visibility: hidden");

                    if (load != null) {
                        interface_utils.setIdStyle("load-button", save.saveName, "visibility: visible");
                        list.style = "margin-right: 36%";
                    }

                }}>
                    {save.saveName}

                    <button id={"load-button" + save.saveName} className={"select-file-btn btn load-button"} onClick={() => {
                        if (window.confirm("Vuoi caricare questo salvataggio?")) {
                            DebugAPI.loadDebugState(save.saveName);
                        }
                    }}>
                        Carica
                    </button>
                </div>
            )
        });
    }
    else
        return;
}



export default SavesOptions;