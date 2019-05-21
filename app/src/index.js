import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";
import Actions from "./actions/Actions";
import StoryAPI from "./utils/StoryAPI";

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
		StoryAPI.getAllCollections();
    }
}).catch(()=>{}).then(()=>{
    ReactDOM.render(<AppContainer/>, document.getElementById('sceneContainer'));
});


