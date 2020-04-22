import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import interface_utils from "./interface_utils";
import Orders from "../../data/Orders";
import ActionTypes from "../../actions/ActionTypes";
import DebugAPI from "../../utils/DebugAPI";
import SavesOptions from "./SavesOptions";
const soundsHub = require('../aframe/soundsHub');
const {mediaURL} = settings;

function Leftbar(props) {

    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    if (props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
        return(
            <div id={'leftbar'} className={'leftbar'}>
                <nav id={'nav-leftbar'}>
                    <div id={'nav-tab-scenes'}
                         className={'nav-tab-rightbar ' + interface_utils.checkSelection('leftbar', 'scenes', props.editor)}
                         onClick={() => {
                             props.leftbarSelection('scenes');
                         }}>
                        Scene
                    </div>
                    <div id={'nav-tab-saves'}
                         className={'nav-tab-rightbar ' + interface_utils.checkSelection('leftbar', 'saves', props.editor)}
                         onClick={() => {
                             props.leftbarSelection('saves')
                         }}>
                        Salvataggi
                    </div>
                </nav>
                <div className={'tab-content'}>
                    {contentLeftbar(props)}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={'leftbar'} id={'leftbar'}>
                {buttonsBar(props)}
                {list(props, path)}
            </div>
        )
    }
}

function contentLeftbar(props){
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    if (props.editor.leftbarSelection === 'scenes'){
        return (
            <div>
                    {buttonsBar(props)}
                    {list(props, path)}
            </div>
        );
    }else{
        return (<SavesOptions {...props}/>);
    }
}


/**
 * Generates scenes list
 * @param props
 * @param path
 * @returns {any[]}
 */
function list(props, path) {
    let regex = RegExp('.*\.mp4$|.MOV$');

    return ([...props.scenes.values()].filter(scene => scene.name.includes(props.editor.scenesNameFilter))
        .filter(scene => scene.name !== 'Ghost Scene').map(child => {
        let s;
        if (props.editor.mode === ActionTypes.DEBUG_MODE_ON) {
            s = {border: '2px solid black'};
            if (props.currentScene == child.uuid)
                s = {border: '2px solid #EF562D'}
        } else
            s = borderStyle(props.tags.get(child.tag).color);

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img)? ".png" : "");

        return (
            <div key={child.name} className={'node_element'}>
                <img
                    src={src}
                    className={'list-img'}
                    alt={child.name}
                    title={interface_utils.title(child.name, props.tags.get(child.tag).name)}
                    onClick={() => {
                        props.updateCurrentScene(child.uuid);
                        Object.values(soundsHub).flat().forEach(a => {
                            a.pause()
                        })
                    }}
                    style={s}
                />
                <div className={'list-labels'}
                     onClick={() => {
                         props.updateCurrentScene(child.uuid);

                     }}
                >
                    <div className={'label-text'}>
                        {child.name}
                    </div>
                </div>
            </div>);
    }));
}

/**
 * Generates buttons banner
 * @param props
 * @returns {*}
 */
function buttonsBar(props) {
    return (
        <div className={'currentOptions'}>
            <div className={"buttonGroup"}>
                <input className="scene-filters" type={'text'} id={'scene-filter-text'} placeholder={'Filtra...'}
                       onChange={() => {
                           let filter = document.getElementById('scene-filter-text').value;
                           props.updateSceneNameFilter(filter);
                       }}/>
                <select id={'select-leftbar'}
                        onChange={() => {
                            let e = document.getElementById('select-leftbar');
                            let order = e.options[e.selectedIndex].value;
                            props.sortScenes(order);
                        }}
                        defaultValue={props.editor.scenesOrder}
                >
                    <option value={Orders.ALPHABETICAL}
                    >Nome (A-Z)
                    </option>
                    <option value={Orders.REV_ALPHABETICAL}
                    >Nome (Z-A)
                    </option>
                    <option value={Orders.CHRONOLOGICAL}
                    >Dalla prima all'ultima
                    </option>
                    <option value={Orders.REV_CHRONOLOGICAL}
                    >Dall'ultima alla prima
                    </option>
                    <option value={Orders.BY_TAG}
                    >Per etichetta
                    </option>
                </select>
                <div id="scenes-order-menu"
                     className={"dropdown-content"}>

                </div>
            </div>
        </div>
    );
}

function borderStyle(color) {
    return {border: '2px solid ' + color};
}


export default Leftbar;
