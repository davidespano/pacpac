import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";

//import '../public/style.css';
//import './aframe.js';
window.localStorage.removeItem("gameID");
window.localStorage.setItem("gameID", "3f585c1514024e9391954890a61d0a04");
AuthenticationApi.login("username", "password").then(()=> {
    ReactDOM.render(<AppContainer/>, document.getElementById('sceneContainer'));
});


SceneAPI.getAllScenesAndTags();
MediaAPI.getAllAssets();