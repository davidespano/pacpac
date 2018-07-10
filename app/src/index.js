import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
//import '../public/style.css';
//import './aframe.js';


ReactDOM.render(<AppContainer />, document.getElementById('sceneContainer'));

window.sessionStorage.setItem("gameID", "3f585c1514024e9391954890a61d0a04");
SceneAPI.getAllScenes();