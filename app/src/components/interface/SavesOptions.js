import React from 'react';
import Immutable from "immutable";
import EditorState from "../../data/EditorState";
import DebugAPI from "../../utils/DebugAPI";
import interface_utils from "./interface_utils";
import settings from "../../utils/settings";
import InputSaveForm from "./InputSaveForm";
import InputLoadForm from "./InputLoadForm";

const {mediaURL} = settings;

function SavesOptions(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div>
            {listSaves(props, path)}
            <InputSaveForm {...props}/>
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

    return ([...props.scenes.values()].map(child => {
        let s;
        s = {border: '2px solid black'};

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img) ? ".png" : "");

        console.log(child.name);


        return (
            <div key={child.name} className={'node_element'}>
                <h6>Salvataggi: {child.name}</h6>
                <img
                    src={src}
                    data-toggle="modal" data-target="#load-modal"
                    className={'list-img'}
                    alt={child.name}
                    title={interface_utils.title(child.name, props.tags.get(child.tag.name))}
                    style={s}
                />
                <InputLoadForm {...props} />
            </div>);
    }));
}



export default SavesOptions;