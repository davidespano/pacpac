import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import InputGameForm from "./InputGameForm";
import GameAPI from "../../utils/GameAPI";
import StoryAPI from "../../utils/StoryAPI";
import AudioAPI from "../../utils/AudioAPI";
import DebugAPI from "../../utils/DebugAPI";
import SetGameId from "./SetGameId";


function GameList(props) {

    return (
        <React.Fragment>
            <InputGameForm {...props} />
            <SetGameId {...props}/>
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
                <div className={'form-group'}>
                    <a id={'gameId-link'} data-toggle="modal" data-target="#gameId-modal">Inserisci un codice</a>
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
                <div className={'game-btns'}>
                    <button
                        title={"Visualizza il codice di " + g.name}
                        id={g.name + '-code-button'}
                        className={"action-buttons-container remove-game-btn"}
                        onClick={() => {
                            alert(g.gameID);
                        }}
                    >
                        <img className={"action-buttons"} src={"icons/icons8-share-30.png"}/>
                    </button>
                    <button
                        title={"Cancella " + g.name}
                        id={g.name + '-remove-button'}
                        className={"action-buttons-container remove-game-btn"}
                        onClick={() => {
                            let answer = window.confirm("Sei sicuro di voler cancellare il gioco " + g.name + '?');
                            if(answer)
                                GameAPI.deleteGame(g.gameID);
                        }}
                    >
                        <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}/>
                    </button>
                </div>

            </div>
        );
    });
}

function gameSelection(gameUuid,props){

    window.localStorage.removeItem("gameID");
    window.localStorage.setItem("gameID", gameUuid);
    props.switchToEditMode();
    SceneAPI.getHomeScene();
    SceneAPI.getAllScenesAndTags();
    MediaAPI.getAllAssets();
	StoryAPI.getAllCollections();
    AudioAPI.getAllAudios();
    DebugAPI.getAllSaves();
}

export default GameList;