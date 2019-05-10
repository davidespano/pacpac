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

    return ([...props.scenes.values()].filter(scene => scene.name.includes(props.editor.scenesNameFilter)).map(child => {
        if (!(regex.test(child.img))) {
            return (
                <div key={child.name} className={'node_element'}>
                    <img
                        src={path + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={interface_utils.title(child.name, props.tags.get(child.tag).name)}
                        onClick={() => {
                            props.updateCurrentScene(child.name);
                        }}
                        style={borderStyle(props.tags.get(child.tag).color)}
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
                    <video
                        muted preload={"auto"}
                        className={'video_element list-video'}
                        onClick={() => {
                            props.updateCurrentScene(child.name);
                        }}
                        title={interface_utils.title(child.name, props.tags.get(child.tag).name)}
                        style={borderStyle(props.tags.get(child.tag).color)}
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
function buttonsBar(props){
    return(
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
                    <option className={'' + checkCurrentOrder(props.editor.scenesOrder, Orders.ALPHABETICAL)}
                            value={Orders.ALPHABETICAL}
                    >Nome (A-Z)</option>
                    <option className={checkCurrentOrder(props.editor.scenesOrder, Orders.REV_ALPHABETICAL)}
                            value={Orders.REV_ALPHABETICAL}
                    >Nome (Z-A)</option>
                    <option className={checkCurrentOrder(props.editor.scenesOrder, Orders.CHRONOLOGICAL)}
                            value={Orders.CHRONOLOGICAL}
                    >Dalla prima all'ultima</option>
                    <option className={checkCurrentOrder(props.editor.scenesOrder, Orders.REV_CHRONOLOGICAL)}
                            value={Orders.REV_CHRONOLOGICAL}
                    >Dall'ultima alla prima</option>
                </select>
                <div id="scenes-order-menu" className={"dropdown-content " + checkSelection(props.editor.scenesOrderMenu)}>

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

function checkSelection(scenesOrderMenu){
    return scenesOrderMenu ? 'show' : '';
}

function checkCurrentOrder(scenesOrder, value){
    return scenesOrder === value ? 'order-selected' : '';
}

function borderStyle(color){
    return {border: '2px solid '+ color};
}


export default Leftbar;