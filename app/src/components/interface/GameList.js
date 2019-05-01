import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import InputGameForm from "./InputGameForm";


function GameList(props) {
    console.log(props);

    return (
        <React.Fragment>
            <InputGameForm {...props} />
            <div className="list-group login-home">
                <h4 className={"loginlabel"}>I tuoi giochi</h4>
                <div className={"gameList"}>
                    {games(props)}
                </div>
                <button className="btn btn-primary" data-toggle="modal" data-target="#add-game-modal">Nuovo gioco</button>
            </div>
        </React.Fragment>
    );
}

function games(props){
    return props.editor.user.games.map((g,i)=>{
        console.log(g);
        return(
            <button id={g} type="button" className="list-group-item list-group-item-action" onClick={evt=>gameSelection(g.gameID,props)}>{g.name}</button>
        );
    });
}

function gameSelection(gameUuid,props){

    window.localStorage.removeItem("gameID");
    window.localStorage.setItem("gameID", gameUuid);
    props.switchToEditMode();
    SceneAPI.getAllScenesAndTags();
    MediaAPI.getAllAssets();

}

export default GameList;