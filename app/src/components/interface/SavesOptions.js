import React from 'react';
import Immutable from "immutable";
import EditorState from "../../data/EditorState";
import DebugAPI from "../../utils/DebugAPI";
import interface_utils from "./interface_utils";
import settings from "../../utils/settings";
import InputSaveForm from "./InputSaveForm";

const {mediaURL} = settings;

function SavesOptions(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return(
        <div>
            {listSaves(props, path)}
            <br/><br/>
            <button className={"btn select-file-btn new-rule-btn"} data-toggle="modal" data-target="#save-modal">
                Salva
            </button>
            <InputSaveForm {...props}/>
            <br/><br/>
            <button className={"btn select-file-btn new-rule-btn"}
                    onClick={() => {
                        if(window.confirm("Vuoi caricare questo salvataggio?")) {
                            DebugAPI.loadDebugState();
                        }
                    }}
            > Carica
            </button>
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
    let regex = RegExp('.*\.mp4$');

    return ([...props.scenes.values()].filter(scene => scene.name.includes(props.editor.scenesNameFilter)).map(child => {
        let s;
        s = {border: '2px solid black'};

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img)? ".png" : "");

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
            </div>);
    }));

}

export default SavesOptions;