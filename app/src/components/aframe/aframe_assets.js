import stores_utils from "../../data/stores_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import settings from "../../utils/settings";
import React from 'react';
import AudioManager from './AudioManager'
import {Entity} from "aframe-react";
const soundsHub = require('./soundsHub');
const {mediaURL} = settings;
/**
 * Classe che si occupa di creare tutti gli assets necessari per la bolla corrente, viene richiamata per ogni bolla
 * @param scene scene con tutte le informazioni al suo interno
 * @param srcBackground source relativa allo sfondo della scena
 * @param runState stato attuale del gioco
 * @param audios lista degli audio
 * @param mode modalita' della scena
 * @param gameId id del gioco
 * @returns {Array}
 */
export default class Asset extends React.Component{

    constructor(props) {
        super(props);

    }
        render() {
            let scene = this.props.scene;
            let srcBackground = this.props.srcBackground;
            let runState = this.props.runState;
            let audios = this.props.audios;
            let mode = this.props.mode;
            let gameId = this.props.gameId;
            let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

            let currAssets = []; //Variabile che conterra' tutti assets
            currAssets.push(<img id="null-mask"
                                 crossOrigin="Anonymous"
                                 src="/null-mask.jpg"
            />)
            currAssets.push(<img id="white-mask"
                                 crossOrigin="Anonymous"
                                 src="https://i.ibb.co/BqMr8j6/white-mask.png"
            />)
            let sceneBackground;
            //Se non è impostato il loop lo imposto a false
            let loop = scene.isVideoInALoop !== undefined ? scene.isVideoInALoop : false;
            //first, push the background media. And check if the media is a video or image
            if (stores_utils.getFileType(scene.img) === 'video') {
                sceneBackground = (
                    <video key={"key" + scene.name} crossOrigin={"anonymous"} id={scene.img} loop={loop} preload="auto"
                           src={`${mediaURL}${id}/` + srcBackground}
                           playsInline={true} muted={true}
                    />)
            } else {
                sceneBackground = (<img id={scene.img} key={"key" + scene.name} crossOrigin="Anonymous"
                                        src={`${mediaURL}${id}/` + srcBackground}
                />)
            }
            currAssets.push(sceneBackground);
            let objAssetMedia;

            //second, push the media of the interactive objs
            // K è media[0], media[1]...
            //Quando ho uno switch ho due media: uno per lo spento (es. media[0]) e uno per l'acceso (es. media[1]) e quello che
            // cambia è che media prende media[0] e media[1]
            Object.values(scene.objects).flat().forEach(obj => {
                if (obj.media) {
                    Object.keys(obj.media).map(k => {
                        if (obj.media[k] !== null) {
                            if (stores_utils.getFileType(obj.media[k]) === 'video') {
                                objAssetMedia = (
                                    <video key={k + "_" + obj.uuid} crossOrigin={"anonymous"} id={k + "_" + obj.uuid}
                                           loop={true} preload="auto"
                                           src={`${mediaURL}${id}/` + obj.media[k]}
                                           playsInline={true} muted={true}
                                    />)
                            } else {
                                objAssetMedia = (
                                    <img id={k + "_" + obj.uuid} key={k + "_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${id}/` + obj.media[k]}
                                    />)
                            }
                            currAssets.push(objAssetMedia)
                        }
                    });

                }

                //Creaizone traccia audio dei singoli oggetti, solo nella modalità gioco
                if (mode === 'scene' && obj.audio) {
                    Object.keys(obj.audio).map(k => {
                        if (obj.audio[k] !== null && audios[obj.audio[k]] !== undefined) {
                            let audioPosition = calculateAudioPosition(audios[obj.audio[k]], obj); //Funzione che converte la posizione da json a coordinate
                            soundsHub[k + "_" + audios[obj.audio[k]].uuid] = AudioManager.generateAudio(audios[obj.audio[k]], audioPosition)
                        }
                    });

                }

                //Genero l'asset dell'oggetto corrente in base allo stato del gioco (runState), se esiste lo aggiungo alla lista degli assets
                let v = generateCurrentAsset(obj, runState, id);
                if (v !== null) currAssets.push(v);

                //Se l'oggetto ha una maschera la aggiungo alla lista degli assets
                if (obj.mask !== "" && obj.mask !== undefined && obj.mask !== null) {
                    currAssets.push(
                        <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossOrigin="Anonymous"
                                      preload="auto"
                                      src={`${mediaURL}${id}/` + obj.mask}
                        />
                    )
                }
            });


            //Creazione traccia audio globali
            //[Vittoria] Tutti gli audio sono dentro soundsHub, le informazioni sono dentro l'oggetto Audio e qua viene fatta questa associazione
            if (mode === 'scene') {
                scene.audios.forEach(audio => {
                    soundsHub["audios_" + audio.uuid] = AudioManager.generateAudio(audio)
                });
            }
            //third, push the media present in the actions
            scene.rules.forEach(() => {
            });
            //return the assets
            return currAssets;
        }
}

/**
 * Funziona che genera i tag HTML degli oggetti interattivi
 * @param obj proprieta' dell'oggetto corrente
 * @param runState stato corrente del gioco
 * @param id id gioco
 * @returns {*}
 */
//[Vittoria] a seconda dell'oggetto carica il media in modo diverso
function generateCurrentAsset(obj, runState, id){
    //TODO e' possibile che la creazione degli assets posso essere semplificata con una funzione, in alcuni casi il codice e' lo stesso
    let currentAsset;
    //console.log("genero oggetto: ", obj.name)
    switch (obj.type) {
        case InteractiveObjectsTypes.TRANSITION:
            if(obj.media.media0 !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${id}/` + obj.media.media0 + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${id}/` + obj.media.media0}/>)
                }
                return(currentAsset)
            }
            else return null;
        case InteractiveObjectsTypes.SWITCH:
            let i;
            //A seconda del momento dell'esecuzione, runstate potrebbe essere non popolato
            if(runState.length === 0){
                //Se sono nello stato off carico il media1 (off-> on), altrimenti media0 (on -> off)
                i = (obj.properties.state === "OFF")?1:0;
            } else {
                i = (runState[obj.uuid].state === "OFF")?1:0;
            }

            //I media hanno come identificatore media0 o media1, a seconda che sia ON o OFF, il controllo precedente mi dice quale devo caricare
            if(obj.media["media"+i] !== null){
                if(stores_utils.getFileType(obj.media["media"+i]) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${id}/` + obj.media["media"+i] + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${id}/` + obj.media["media"+i]}/>)
                }
                return(currentAsset)
            }
            else if (obj.media["media"+((i+1)%2)] !== null){
                if(stores_utils.getFileType(obj.media["media"+i]) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${id}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${id}/` + obj.media["media"+((i+1)%2)]}/>)
                }
                return(currentAsset)
            }
            else return null;
        case InteractiveObjectsTypes.KEY:
            if(obj.media.media0 !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${id}/` + obj.media.media0 + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${id}/` + obj.media.media0}/>)
                }
                return(currentAsset)
            }
            else return null;
        default:
            return null;
    }
}

//Calculation audio position from object
function calculateAudioPosition (audio, obj){
    //Separo la stringa contenente le coordinate del file
    let vertices = obj.vertices.split(/[ ,]/).map(function(item) {
        return parseFloat(item, 10);
    });

    let baricenter = [0, 0, 0];
    let nPoints = vertices.length / 3;
    vertices.forEach(v =>{
       baricenter[vertices.indexOf(v)%3] += v/nPoints;
    });

    return baricenter;
}
/*export default {
    generateAsset: generateAsset
}*/