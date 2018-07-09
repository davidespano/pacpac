import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import Scene from "./scene/Scene";
//import '../public/style.css';
//import './aframe.js';


ReactDOM.render(<AppContainer />, document.getElementById('sceneContainer'));

SceneAPI.getAllScenes();