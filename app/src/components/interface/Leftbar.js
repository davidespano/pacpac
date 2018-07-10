import React from 'react';
import settings from '../../utils/settings';
import SceneAPI from "../../utils/SceneAPI";

const {mediaURL} = settings;

function Leftbar(props){

    return(
        <div className={'leftbar'}>
            {[...props.leftbar.values()].map(child => (
                <div key={child.name}>
                    <label className={"list-title"}>{child.name}</label>
                    <img
                        src={`${mediaURL}${window.sessionStorage.getItem("gameID")}/` + child.img}
                        className={'list-img'}
                        alt={child.name}
                        title={title(child)}
                        onClick={()=> SceneAPI.getByName(child.img)}
                    />
                </div>
            ))}
        </div>
    )
}

function title(child){

    return (
        "Scena: " + child.name +
        "\nEtichetta: " + child.tag.tagName
    );
}


export default Leftbar;