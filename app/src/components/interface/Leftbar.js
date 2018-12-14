import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import interface_utils from "./interface_utils";
import Orders from "../../data/Orders";



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

    return ([...props.scenes.values()].map(child => {
        if (!(regex.test(child.img))) {
            return (
                <div key={child.name} className={'node_element'}>
                    <img
                        src={path + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={interface_utils.title(child)}
                        onClick={() => {
                            props.updateCurrentScene(child.name);
                        }}

                    />
                    <div className={'list-labels'}
                         onClick={() => {
                            props.updateCurrentScene(child.name);
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
                    <video muted preload={"auto"} className={'video_element list-video'} onClick={() => {
                        props.updateCurrentScene(child.name);
                    }}>
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
function buttonsBar(props){
    return(
        <div className={'currentOptions'}>
            <div className={"buttonGroup"}>
                <button
                    title={"Cerca una scena"}
                    className={"action-buttons-container"}
                >
                    <img className={"action-buttons"} src={"icons/icons8-search-filled-50.png"}/>
                </button>
                <button
                    title={"Ordina..."}
                    className={"action-buttons-container dropdown-btn"}
                >
                    <img className={"action-buttons dropdown-btn"} src={"icons/icons8-sort-filled-50.png"}/>
                </button>
                <div id="scenes-order-menu" className={"dropdown-content " + checkSelection(props.editor.scenesOrderMenu)}>
                    <a className={'' + checkCurrentOrder(props.editor.scenesOrder, Orders.ALPHABETICAL)}
                       onClick={() => props.sortScenes(Orders.ALPHABETICAL)}
                    >Per nome (A-Z)</a>
                    <a className={checkCurrentOrder(props.editor.scenesOrder, Orders.REV_ALPHABETICAL)}
                       onClick={() => props.sortScenes(Orders.REV_ALPHABETICAL)}
                    >Per nome (Z-A)</a>
                    <a className={checkCurrentOrder(props.editor.scenesOrder, Orders.CHRONOLOGICAL)}
                        onClick={() => props.sortScenes(Orders.CHRONOLOGICAL)}
                    >Dalla prima all'ultima</a>
                    <a className={checkCurrentOrder(props.editor.scenesOrder, Orders.REV_CHRONOLOGICAL)}
                       onClick={() => props.sortScenes(Orders.REV_CHRONOLOGICAL)}
                    >Dall'ultima alla prima</a>
                </div>
            </div>
        </div>
    );
}

function checkSelection(scenesOrderMenu){
    return scenesOrderMenu ? 'show' : '';
}

function checkCurrentOrder(scenesOrder, value){
    return scenesOrder === value ? 'order-selected' : '';
}


export default Leftbar;