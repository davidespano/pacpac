import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";

//import '../public/style.css';
//import './aframe.js';

ReactDOM.render(<AppContainer/>, document.getElementById('sceneContainer'));

window.localStorage.removeItem("gameID");
window.localStorage.setItem("gameID", "3f585c1514024e9391954890a61d0a03");
AuthenticationApi.login("username", "password");
SceneAPI.getAllScenes();
MediaAPI.getAllAssets();