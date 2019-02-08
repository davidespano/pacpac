import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";


function GameList(props) {

    console.log(props);
    let buttons = props.editor.user.games.map((g,i)=>{

       return(
           <button id={g} type="button" className="list-group-item list-group-item-action" onClick={evt=>gameSelection(g,props)}>Gioco {i+1}</button>
       );
    });

    return (
        <div class="list-group">
            {buttons}
        </div>
    );
}

function gameSelection(event,props){

    window.localStorage.removeItem("gameID");
    window.localStorage.setItem("gameID", event);
    props.switchToEditMode();
    SceneAPI.getAllScenesAndTags();
    MediaAPI.getAllAssets();

}

export default GameList;