import stores_utils from "../../data/stores_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import settings from "../../utils/settings";
import React from 'react';
import AudioManager from './AudioManager';
import Utils from '../interface/interface_utils.js';
const soundsHub = require('./soundsHub');
const {mediaURL} = settings;
//TODO trasformarlo in un componente React ... forse ...
/**
 * Funzione che si occupa di creare tutti gli assets necessari per la bolla corrente, viene richiamata per ogni bolla
 * @param scene scene con tutte le informazioni al suo interno
 * @param srcBackground source relativa allo sfondo della scena
 * @param runState stato attuale del gioco
 * @param audios lista degli audio
 * @param mode modalita' della scena
 * @param gameId id del gioco
 * @returns {Array}
 */
function generateAsset(scene, srcBackground, runState = [], audios, mode = 'scene', gameId = null){
    let id = gameId ? gameId : `${window.localStorage.getItem("gameID")}`;

        let currAssets = []; //Variabile che conterra' tutti assets
        let sceneBackground;
        //TODO verificare, se non impostato risulta undefined
        //Se non è impostato il loop lo imposto a false
        let loop = scene.isVideoInALoop !== undefined ? scene.isVideoInALoop : false;
        //first, push the background media. And check if the media is a video or image
        if(stores_utils.getFileType(scene.img) === 'video'){
            sceneBackground = (
                <video key={"key" + scene.name} crossOrigin={"anonymous"} id={scene.img} loop={loop}  preload="auto"
                       src={`${mediaURL}${id}/` + srcBackground}
                       playsInline={true}  muted={true}
                />)
        } else {
            sceneBackground =(<img id={scene.img} key={"key" + scene.name} crossOrigin="Anonymous"
                                   src={`${mediaURL}${id}/` + srcBackground}
            />)
        }
        currAssets.push(sceneBackground);
        let objAssetMedia;

        //second, push the media of the interactive objs
        Object.values(scene.objects).flat().forEach(obj => {
            if(obj.media){
                Object.keys(obj.media).map(k => {
                    if(obj.media[k] !== null){
                        if(stores_utils.getFileType(obj.media[k]) === 'video'){
                            objAssetMedia = (
                                <video key={k+"_" + obj.uuid} crossOrigin={"anonymous"} id={k+"_" + obj.uuid} loop={true}  preload="auto"
                                       src={`${mediaURL}${id}/` + obj.media[k]}
                                       playsInline={true}  muted={true}
                                />)
                        } else {
                            objAssetMedia = (<img id={k+"_" + obj.uuid} key={k+"_" + obj.uuid} crossOrigin="Anonymous"
                                                  src={`${mediaURL}${id}/` + obj.media[k]}
                            />)
                        }
                        currAssets.push(objAssetMedia)
                    }
                });

            }

            //Creaizone traccia audio dei singoli oggetti, solo nella modalità gioco
            if(mode === 'scene' && obj.audio){
                Object.keys(obj.audio).map(k => {
                    if(obj.audio[k] !== null  && audios[obj.audio[k]] !== undefined){
                        let audioPosition = calculateAudioPosition(audios[obj.audio[k]], obj); //Funzione che converte la posizione da json a coordinate
                        soundsHub[k+"_" + audios[obj.audio[k]].uuid] = AudioManager.generateAudio(audios[obj.audio[k]], audioPosition)
                    }
                });


            }

            //Genero l'asset dell'oggetto corrente, se esiste lo aggiungo alla lista degli assets
            let v = generateCurrentAsset(obj, runState, id);
            if(v!==null) currAssets.push(v);

            //Se l'oggetto ha una maschera la aggiungo alla lista degli assets
            if(obj.mask !== "" && obj.mask !== undefined&& obj.mask !== null){
                currAssets.push(
                    <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossOrigin="Anonymous"
                                  preload="auto"
                                  src={`${mediaURL}${id}/` + obj.mask}
                    />
                )
            }
        });

        //Scorro tutte le regole e carico i media coinvolti nelle regole, come per esempio un cambio sfondo
        scene.rules.forEach( rule => {
            rule.actions.forEach(action => {
                if(action.action === 'CHANGE_BACKGROUND'){
                    if(stores_utils.getFileType(action.obj_uuid) === 'video'){
                        currAssets.push(
                            <video id={action.obj_uuid} key={"key" + action.obj_uuid}
                                   src={`${mediaURL}${id}/` + action.obj_uuid}
                                   preload="auto" loop={'true'} crossOrigin="anonymous" playsInline={true} muted={true}
                            />
                        )
                    } else {
                        currAssets.push(<img id={action.obj_uuid} key={"key" + action.obj_uuid} crossOrigin="Anonymous"
                                             src={`${mediaURL}${id}/` + action.obj_uuid}
                        />)
                    }
                }
                if(action.action === 'PLAY_LOOP' || action.action === 'PLAY_LOOP'){
                    console.log('ciao sono un adio un po sfortunato')
                }
            })

        });

        //Creaizone traccia audio globali
        if(mode === 'scene') {
            scene.audios.forEach(audio => {
                soundsHub["audios_" + audio.uuid] = AudioManager.generateAudio(audio)
            });
        }
        //third, push the media present in the actions
        //TODO do it! maybe not necessary
        scene.rules.forEach(()=>{});
        //return the assets
        return currAssets;
}

/**
 * Funziona che genera i tag HTML degli oggetti interattivi
 * @param obj proprieta' dell'oggetto corrente
 * @param runState stato corrente del gioco
 * @param id id gioco
 * @returns {*}
 */
function generateCurrentAsset(obj, runState, id){
    //TODO e' possibile che la creazione degli assets posso essere semplificata con una funzione, in alcuni casi il codice e' lo stesso
    let currentAsset;
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
            //Aseconda del momento dell'esecuzione, runstate potrebbe essere non popolato
            if(runState.length === 0){
                i = (obj.properties.state !== "OFF")?0:1;
            } else {
                i = (runState[obj.uuid].state !== "OFF")?0:1;
            }

            //I media hanno come identificatore   media0 o media1, a seconda che sia ON o OFF, il controllo precedente mi dice quale devo caricare
            if(obj.media["media"+i] !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
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
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
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
            return <img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                 src={Utils.getObjImg(obj.type)}/>;
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
export default {
    generateAsset: generateAsset
}
