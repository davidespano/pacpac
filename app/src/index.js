import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";
import Actions from "./actions/Actions";

//import '../public/style.css';
//import './aframe.js';

AuthenticationApi.isUserAuthenticated().then((response)=>{
    let gameUuid = window.localStorage.getItem("gameID");
    if (gameUuid === null || (!response.body.games.includes(gameUuid)))
        throw gameUuid;
    else {
        Actions.editModeOn();
        SceneAPI.getAllScenesAndTags();
        MediaAPI.getAllAssets();
    }
}).catch(()=>{}).then(()=>{
    ReactDOM.render(<AppContainer/>, document.getElementById('sceneContainer'));
    Actions.updateRuleEditorFromHTML("<a>Magia </a>Ciao sono una regola e sono bella");
});