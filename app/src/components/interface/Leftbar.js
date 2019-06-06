import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import interface_utils from "./interface_utils";
import Orders from "../../data/Orders";
import ActionTypes from "../../actions/ActionTypes";


const {mediaURL} = settings;

function Leftbar(props) {

    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div className={'leftbar'} id={'leftbar'}>
            {buttonsBar(props)}
            {list(props, path)}
        </div>
    )
}

/**
 * Generates scenes list
 * @param props
 * @param path
 * @returns {any[]}
 */
function list(props, path) {
    let regex = RegExp('.*\.mp4$');

    return ([...props.scenes.values()].filter(scene => scene.name.includes(props.editor.scenesNameFilter)).map(child => {
        let s;
        if (props.editor.mode === ActionTypes.DEBUG_MODE_ON) { //TODO [debug] add to origin master
            s = {border: '2px solid black'};
            if (props.currentScene == child.uuid)
                s = {border: '2px solid #EF562D'}
        } else
            s = borderStyle(props.tags.get(child.tag).color);
        if (!(regex.test(child.img))) {
            return (
                <div key={child.name} className={'node_element'}>
                    <img
                        src={path + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={interface_utils.title(child.name, props.tags.get(child.tag.name))}
                        onClick={() => {
                            if (props.editor.mode !== ActionTypes.DEBUG_MODE_ON) //TODO [debug] add to origin master
                                props.updateCurrentScene(child.uuid);
                        }}
                        style={s}
                    />
                    <div className={'list-labels'}
                         onClick={() => {
                             if (props.editor.mode !== ActionTypes.DEBUG_MODE_ON) //TODO [debug] add to origin master
                                 props.updateCurrentScene(child.uuid);
                         }}
                    >
                        <div className={'label-text'}>
                            {child.name}
                        </div>
                    </div>
                </div>)
        } else {
            return (
                <div key={child.name} className={'node_element'}>
                    <video
                        muted preload={"auto"}
                        className={'video_element list-video'}
                        onClick={() => {
                            if (props.editor.mode !== ActionTypes.DEBUG_MODE_ON) //TODO [debug] add to origin master
                                props.updateCurrentScene(child.uuid);
                        }}
                        title={interface_utils.title(child.name, props.tags.get(child.tag).name)}
                        style={s}
                    >
                        <source src={path + child.img} type="video/mp4"/>
                    </video>
                    <div className={'list-labels'}>
                        <div className={'label-text'}>
                            {child.name}
                        </div>
                    </div>
                </div>
            )
        }
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
                <input type={'text'} id={'scene-filter-text'} placeholder={'Filtra...'}
                       onChange={() => {
                           let filter = document.getElementById('scene-filter-text').value;
                           props.updateSceneNameFilter(filter);
                       }}/>
                <select id={'select-leftbar'}
                        onChange={() => {
                            let e = document.getElementById('select-leftbar');
                            let order = e.options[e.selectedIndex].value;
                            props.sortScenes(order);
                        }}>
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
                </select>
                <div id="scenes-order-menu"
                     className={"dropdown-content " + checkSelection(props.editor.scenesOrderMenu)}>

                </div>
            </div>
        </div>
    );
}

/*
<button
    title={"Ordina..."}
    className={"action-buttons-container dropdown-btn"}
>
    <img className={"action-buttons dropdown-btn"} src={"icons/icons8-sort-filled-50.png"}/>
</button>
*/

function checkSelection(scenesOrderMenu) {
    return scenesOrderMenu ? 'show' : '';
}

function checkCurrentOrder(scenesOrder, value) {
    return scenesOrder === value ? 'order-selected' : '';
}

function borderStyle(color) {
    return {border: '2px solid ' + color};
}


export default Leftbar;