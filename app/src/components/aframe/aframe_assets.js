import stores_utils from "../../data/stores_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import settings from "../../utils/settings";
import React from 'react';
import AudioManager from './AudioManager'
const soundsHub = require('./soundsHub');
const {mediaURL} = settings;
//TODO trasformarlo in un componente React ... forse ...
function generateAsset(scene, srcBackground, runState = [], audios, mode = 'scene'){
        let currAssets = [];
        let sceneBackground;

        //first, push the background media.
        if(stores_utils.getFileType(scene.img) === 'video'){
            sceneBackground = (
                <video key={"key" + scene.name} crossOrigin={"anonymous"} id={scene.img} loop={true}  preload="auto"
                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + srcBackground}
                       playsInline={true} autoPlay muted={true}
                />)
        } else {
            sceneBackground =(<img id={scene.img} key={"key" + scene.name} crossOrigin="Anonymous"
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + srcBackground}
            />)
        }
        currAssets.push(sceneBackground);
        let objAssetMedia;

        //second, push the media of the interactive objs
        Object.values(scene.objects).flat().forEach(obj => {
            Object.keys(obj.media).map(k => {
                if(obj.media[k] !== null){
                    if(stores_utils.getFileType(obj.media[k]) === 'video'){
                        objAssetMedia = (
                            <video key={k+"_" + obj.uuid} crossOrigin={"anonymous"} id={k+"_" + obj.uuid} loop={true}  preload="auto"
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                                   playsInline={true} autoPlay muted={true}
                            />)
                    } else {
                        objAssetMedia = (<img id={k+"_" + obj.uuid} key={k+"_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                        />)
                    }
                    currAssets.push(objAssetMedia)
                }
            });

            //Creaizone traccia audio dei singoli oggetti, solo nella modalità gioco
            if(mode === 'scene'){
                Object.keys(obj.audio).map(k => {
                    //TODO a volte se esiste l'audio non è presente nella lista degli audio, verificare
                    if(obj.audio[k] !== null && audios[obj.audio[k]] !== undefined){
                        console.log(obj.audio[k])
                        let audioPosition = calculateAudioPosition(audios[obj.audio[k]], obj)
                        soundsHub[k+"_" + audios[obj.audio[k]].uuid] = AudioManager.generateAudio(audios[obj.audio[k]], audioPosition)
                    }
                });
            }

            let v = generateCurrentAsset(obj, runState);
            if(v!==null) currAssets.push(v);

            if(obj.mask !== "" && obj.mask !== undefined&& obj.mask !== null){
                currAssets.push(
                    <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossOrigin="Anonymous"
                                  preload="auto"
                                  src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.mask}
                    />
                )
            }
        });

        scene.rules.forEach( rule => {
            rule.actions.forEach(action => {
                if(action.action === 'CHANGE_BACKGROUND'){
                    if(stores_utils.getFileType(action.obj_uuid) === 'video'){
                        currAssets.push(
                            <video id={action.obj_uuid} key={"key" + action.obj_uuid}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + action.obj_uuid}
                                   preload="auto" loop={'true'} crossOrigin="anonymous" playsInline={true} muted={true}
                            />
                        )
                    } else {
                        currAssets.push(<img id={action.obj_uuid} key={"key" + action.obj_uuid} crossOrigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + action.obj_uuid}
                        />)
                    }
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

function generateCurrentAsset(obj, runState){
    let currentAsset;
    switch (obj.type) {
        case InteractiveObjectsTypes.TRANSITION:
            if(obj.media.media0 !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else return null;
        case InteractiveObjectsTypes.SWITCH:
            let i;
            if(runState.length === 0){
                i = (obj.properties.state !== "OFF")?0:1;
            } else {
                i = (runState[obj.uuid].state !== "OFF")?0:1;
            }

            if(obj.media["media"+i] !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else if (obj.media["media"+((i+1)%2)] !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else return null;
        case InteractiveObjectsTypes.KEY:
            if(obj.media.media0 !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}
                               preload="auto" loop={false} crossOrigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossOrigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
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