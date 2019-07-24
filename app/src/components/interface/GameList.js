import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import InputGameForm from "./InputGameForm";
import GameAPI from "../../utils/GameAPI";
import StoryAPI from "../../utils/StoryAPI";
import AudioAPI from "../../utils/AudioAPI";
import DebugAPI from "../../utils/DebugAPI";


function GameList(props) {

    return (
        <React.Fragment>
            <InputGameForm {...props} />
            <div className="list-group login-home">
                <h4 className={"loginlabel"}>I tuoi giochi</h4>
                <div className={"gameList"}>
                    {games(props)}
                </div>
                <div className={'form-group'}>
                    <button className="btn login-btn" data-toggle="modal" data-target="#add-game-modal">Nuovo gioco</button>
                </div>
                <div className={'form-group'}>
                    <a id={'logout-link'} onClick={()=> {
                        props.reset();
                        window.localStorage.clear();
                        props.switchToLoginMode();
                    }}>Logout</a>
                </div>
            </div>
        </React.Fragment>
    );
}

function games(props){
    return props.editor.user.games.map((g,i)=>{
        return(
            <div className={'game-item-wrapper'}>
                <div id={g} className="game-item" onClick={evt=>gameSelection(g.gameID,props)}>{g.name}</div>
                <button
                    title={"Cancella " + g.name}
                    id={g.name + '-remove-button'}
                    className={"action-buttons-container remove-game-btn"}
                    onClick={() => {
                        let answer = window.confirm("Sei sicuro di voler cancellare il gioco " + g.name + '?');
                        console.log(answer);
                        if(answer)
                            GameAPI.deleteGame(g.gameID);
                    }}
                >
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}/>
                </button>
            </div>
        );
    });
}

function gameSelection(gameUuid,props){

    window.localStorage.removeItem("gameID");
    window.localStorage.setItem("gameID", gameUuid);
    props.switchToEditMode();
    SceneAPI.getAllScenesAndTags();
    MediaAPI.getAllAssets();
	StoryAPI.getAllCollections();
    AudioAPI.getAllAudios();
    DebugAPI.getAllSaves();
}

export default GameList;