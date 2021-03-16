import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import InputGameForm from "./InputGameForm";
import GameAPI from "../../utils/GameAPI";
import StoryAPI from "../../utils/StoryAPI";
import AudioAPI from "../../utils/AudioAPI";
import DebugAPI from "../../utils/DebugAPI";
import SetGameId from "./SetGameId";
import './../../Store/Store-style.css'
import Actions from "../../actions/Actions";

const guestUsername = "ospite";

function GameList(props) {
    let gamesDiv;
    if(props.editor.user.username === guestUsername)
    {
        gamesDiv =
            <div className="list-group login-home">
                <h4 className={"loginlabel"}>Benvenuto Ospite</h4>
                <div className={"gameList"}>
                    <h5 className={"loginlabel"}>Caricamento in corso</h5>
                </div>
                <div id={'store-container'}>
                    <div id={'div-newGame'} className={'form-group'}>
                        <button disabled={true} id={'btn-newGame'} className="btn login-btn" data-toggle="modal" data-target="#add-game-modal">Nuovo gioco</button>
                    </div>
                    <div id={'div-store'} className={'form-group'}>
                        <button id={'btn-store'} className="btn login-btn"
                                onClick={evt=>sendCookie(props.editor.user)}>Store</button>
                    </div>
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
    }
    else
    {
        gamesDiv =
            <div className="list-group login-home">
                <h4 className={"loginlabel"}>I tuoi giochi</h4>
                <div className={"gameList"}>
                    {games(props)}
                </div>
                <div id={'store-container'}>
                    <div id={'div-newGame'} className={'form-group'}>
                        <button id={'btn-newGame'} className="btn login-btn" data-toggle="modal" data-target="#add-game-modal">Nuovo gioco</button>
                    </div>
                    <div id={'div-store'} className={'form-group'}>
                        <button id={'btn-store'} className="btn login-btn"
                                onClick={evt=>sendCookie(props.editor.user)}>Store</button>
                    </div>
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
                <div id={'store-container'}>
                    <div id={'div-newGame'} hidden={true} className={'form-group'}>
                        <button id={'btn-newGame'} className="btn login-btn"
                                onClick={()=>{
                                    document.documentElement.style.setProperty('--pacMain', '#EF562D');
                                    document.documentElement.style.setProperty('--pacBorder', '#DD4124');
                                    document.documentElement.style.setProperty('--pacHover', '#ff4500');
                                    document.documentElement.style.setProperty('--pacRuleHighlight', '#FFD8AC');
                                    document.documentElement.style.setProperty('--pacItemHover', '#FFD8AC');
                                }
                                }>Arancione</button>
                    </div>
                    <div id={'div-store'} hidden={true} className={'form-group'}>
                        <button id={'btn-store'} className="btn login-btn"
                                onClick={()=>{
                                    document.documentElement.style.setProperty('--pacMain', '#2d64ef');
                                    document.documentElement.style.setProperty('--pacBorder', '#243ddd');
                                    document.documentElement.style.setProperty('--pacHover', '#0099ff');
                                    document.documentElement.style.setProperty('--pacRuleHighlight', '#acf3ff');
                                    document.documentElement.style.setProperty('--pacItemHover', '#acfff5');
                                }
                                }>Blu</button>
                    </div>
                </div>

            </div>
    }

    return (
        <React.Fragment>
            <div className={"loginBackground"}>
                <InputGameForm {...props} />
                <SetGameId {...props}/>
                {gamesDiv}
            </div>
        </React.Fragment>
    );
}

function games(props){
    return props.editor.user.games.map((g,i)=>{
        return(
            <div className={'game-item-wrapper'}>
                <div id={g} className="game-item" onClick={evt=>gameSelection(g.gameID, g.name, props)}>{g.name}</div>
                <div className={'game-btns'}>
                    <button
                        title={"Pubblica " + g.name + " sullo store"}
                        id={g.name + '-upload-button'}
                        className={"action-buttons-container"}
                        onClick={() => {setUrltoStore(g.name, g.gameID, props.editor.user);
                        }}
                    >
                        <img className={"action-buttons"} src={"icons/upload-30.png"}/>
                    </button>
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

function sendCookie(a) {
    document.cookie = "usernameToken" + "=" + a.username + "" + "; path=/"
    document.cookie = "uuidToken" + "=" + a.uuid + "" + "; path=/"
    window.location.href='https://cg3hci.dmi.unica.it/pacpac-games/'
}

function setUrltoStore(gameName, gameId, user) {
    document.cookie = "usernameToken" + "=" + user.username + "" + "; path=/"
    document.cookie = "uuidToken" + "=" + user.uuid + "" + "; path=/"
    window.location.href='https://cg3hci.dmi.unica.it/pacpac-games/PostForm?gameName=' + gameName + '&gameId='+ gameId
}


function gameSelection(gameUuid, gameTitle ,props){

    window.localStorage.removeItem("gameID");
    window.localStorage.setItem("gameID", gameUuid);
    props.switchToEditMode();
    props.setGameTitle(gameTitle);
    SceneAPI.getHomeScene();
    SceneAPI.getAllScenesAndTags();
    MediaAPI.getAllAssets();
	StoryAPI.getAllCollections();
    AudioAPI.getAllAudios();
    DebugAPI.getAllSaves();
}

export default GameList;