import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import SceneAPI from './utils/SceneAPI';
import AuthenticationApi from './utils/AuthenticationAPI';
import MediaAPI from "./utils/MediaAPI";
import Actions from "./actions/Actions";

//import '../public/style.css';
//import './aframe.js';

const provaRaw = {
    blocks: [
        {
            text: 'QUANDO soggetto evento oggetto-scena, ',
            type: 'quando-block',
            entityRanges: [
                {offset: 0, length: 6, key: 'quando'},
                {offset: 7, length: 8, key: 'soggetto'},
                {offset: 16, length: 6, key: 'evento'},
                {offset: 23, length: 13, ket: 'oggettoScena'},
            ],
        },
        {
            text: 'SE oggetto operatore valore, ',
            type: 'se-block',
            entityRanges: [
                {offset: 0, length: 2, key: 'se'},
                {offset: 3, length: 7, key: 'oggetto'},
                {offset: 11, length: 9, key: 'operatore'},
                {offset: 21, length: 6, key: 'valore'},
            ],
        },
        {
            text: 'ALLORA azione ',
            type: 'allora-block',
            entityRanges: [
                {offset: 0, length: 6, key: 'allora'},
                {offset: 7, length: 6, key: 'azione'},
            ],
        }
    ],
    entityMap: {
        quando: {type: 'quando', data: 'quando'},
        soggetto: {type: 'soggetto', data: 'soggetto', mutability: 'MUTABLE'},
        evento: {type: 'evento', data: 'evento', mutability: 'MUTABLE'},
        oggettoScena: {type: 'oggettoScena', data: 'oggettoScena', mutability: 'MUTABLE'},
        se: {type: 'se', data: 'se'},
        oggetto: {type: 'oggetto', data: 'oggetto', mutability: 'MUTABLE'},
        operatore: {type: 'operatore', data: 'operatore', mutability: 'MUTABLE'},
        valore: {type: 'valore', data: 'valore', mutability: 'MUTABLE'},
        allora: {type: 'allora', data: 'allora'},
        azione: {type: 'azione', data: 'azione', mutability: 'MUTABLE'},
    },
};


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
    Actions.updateRuleEditorFromHTML(provaRaw);
});


