import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";
import interface_utils from "./interface_utils";


const {mediaURL} = settings;

function Leftbar(props) {

    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div className={'leftbar'} id={'leftbar'}>
            {buttonsBar()}
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
                            //let scene = props.scenes.get(child.name);
                            //SceneAPI.getByName(child.img, scene);
                            props.updateCurrentScene(child.name);
                        }}

                    />
                    <div className={'list-labels'}
                         onClick={() => {
                            //let scene = props.scenes.get(child.name);
                            //SceneAPI.getByName(child.img, scene);
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
                        //let scene = props.scenes.get(child.name);
                        //SceneAPI.getByName(child.img, scene);
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
 * @returns {*}
 */
function buttonsBar(){
    return(
        <div className={'currentOptions'}>
            <div className={"buttonGroup"}>
                <button
                    title={"Cerca una scena"}
                    className={"action-buttons-container"}
                >
                    <img className={"action-buttons"} src={"icons8-search-filled-50.png"}/>
                </button>
            </div>
        </div>
    );
}

export default Leftbar;