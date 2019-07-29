import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";
import Actions from "./actions/Actions";
import StoryAPI from "./utils/StoryAPI";
import AudioAPI from "./utils/AudioAPI";
import DebugAPI from "./utils/DebugAPI";
import Audio from "./audio/Audio";
import EditorStateStore from "./data/EditorStateStore";

//import '../public/style.css';
//import './aframe.js';


AuthenticationApi.isUserAuthenticated().then((response)=>{
    let gameUuid = window.localStorage.getItem("gameID");
    const gameIDs = response.body.games.map(g => g.gameID);
    if (gameUuid === null || (!gameIDs.includes(gameUuid)))
        AuthenticationApi.getUserDetail();
    else {
        Actions.editModeOn();
        SceneAPI.getAllScenesAndTags();
        MediaAPI.getAllAssets();
        AudioAPI.getAllAudios();
		StoryAPI.getAllCollections();
		DebugAPI.getAllSaves();
		//If modified edit gameSelection in components/interface/GameList.js
    }
}).catch(()=>{}).then(()=>{
    ReactDOM.render(<AppContainer/>, document.getElementById('sceneContainer'));
});