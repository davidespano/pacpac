import React from 'react';
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import interface_utils from "./interface_utils";
import scene_utils from "../../scene/scene_utils";
import TagDropdown from "./TagDropdown";
import FileSelectionBtn from "./FileSelectionBtn";
import Values from "../../interactives/rules/Values";
import Dropdown from "./Dropdown";
import stores_utils from "../../data/stores_utils";
import Orders from "../../data/Orders";
import SceneOptions from "./SceneOptions";
import ObjectOptions from "./ObjectsOptions";

let THREE = require('three');

function RightBar(props){

    return(
        <div className={'rightbar'}>
        	{view(props)}
        	<div className={'rightbar-footer'}> </div>
        </div>
    );
}


/**
 * Generates upper buttons for scene or objects selection, and calls upon another function to generate content
 * @param props
 * @returns {*}
 */
function view(props){
    return(
        <div id={'rightbarView'}>
            <nav id={'nav-rightbar'}>
                <div id={'nav-tab-scene'}
                     className={'nav-tab-rightbar ' + interface_utils.checkSelection('rightbar', 'scene', props.editor)}
                     onClick={() => {
                         props.rightbarSelection('scene');
                     }}>
                    Scena
                </div>
                <div id={'nav-tab-objects'}
                     className={'nav-tab-rightbar ' + interface_utils.checkSelection('rightbar', 'objects', props.editor)}
                     onClick={() => {
                         props.rightbarSelection('objects')
                     }}>
                    Oggetti
                </div>
            </nav>
            <div className={'tab-content'}>
                {content(props)}
            </div>
        </div>
    );
}

/**
 * Generates content relative to scene or to objects according to the given selection
 * @param props
 * @returns {*}
 */
function content(props){
    return props.editor.rightbarSelection === 'scene' ? <SceneOptions {...props}/> : <ObjectOptions {...props}/>;
}


export default RightBar;