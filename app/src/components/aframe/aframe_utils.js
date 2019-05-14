import stores_utils from "../../data/stores_utils";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import settings from "../../utils/settings";
import React from 'react';

const {mediaURL} = settings;

function generateAsset(scene, srcBackground, runState = []){
        let currAssets = [];
        let sceneBackground;
        //first, push the background media.
        if(stores_utils.getFileType(scene.img) === 'video'){
            sceneBackground = (
                <video key={"key" + scene.name} crossOrigin={"anonymous"} id={scene.img} loop={"true"}  preload="auto"
                       src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + srcBackground}
                       playsInline={true} autoPlay muted={true}
                />)
        } else {
            sceneBackground =(<img id={scene.img} key={"key" + scene.name} crossorigin="Anonymous"
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + srcBackground}
            />)
        }
        currAssets.push(sceneBackground);
        let objAsset;
        //second, push the media of the interactive objs
        Object.values(scene.objects).flat().forEach(obj => {
            Object.keys(obj.media).map(k => {
                if(obj.media[k] !== null){
                    if(stores_utils.getFileType(obj.media[k]) === 'video'){
                        objAsset = (
                            <video key={k+"_" + obj.uuid} crossorigin={"anonymous"} id={k+"_" + obj.uuid} loop={"true"}  preload="auto"
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                                   playsInline={true} autoPlay muted={true}
                            />)
                    } else {
                        objAsset = (<img id={k+"_" + obj.uuid} key={k+"_" + obj.uuid} crossorigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media[k]}
                        />)
                    }
                    currAssets.push(objAsset)
                }
            });

            let v = generateCurrentAsset(obj, runState);
            if(v!==null) currAssets.push(v);

            if(obj.mask !== "" && obj.mask !== undefined&& obj.mask !== null){
                currAssets.push(
                    <a-asset-item id={"mask_" + obj.uuid} key={"mask_" + obj.uuid} crossorigin="Anonymous"
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
                                   preload="auto" loop={'true'} crossorigin="anonymous" playsInline={true} muted={true}
                            />
                        )
                    } else {
                        currAssets.push(<img id={action.obj_uuid} key={"key" + action.obj_uuid} crossorigin="Anonymous"
                                             src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + action.obj_uuid}
                        />)
                    }
                }
            })

        });
        /*scene.audio.forEach( audio => {
            currAssets.push(<audio id="track" key={'track_'+this.state.activeScene.uuid} crossOrigin={"anonymous"}
                                   src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + 'four_channel_output.mp4'}
                                   preload="auto" onLoad={"this.generateAudio()"}/>)
        })*/
        /*currAssets.push(<audio id="track" key={'track_'+this.state.activeScene.uuid} crossOrigin={"anonymous"}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + 'four_channel_output.mp4'}
                               preload="auto" onLoad={"this.generateAudio()"}/>)*/
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
                               preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else return null;
        case InteractiveObjectsTypes.SWITCH:
            let i;
            if(runState === {}){
                i = (obj.properties.state === "OFF")?0:1;
            } else {
                i = (runState[obj.uuid].state === "OFF")?0:1;
            }

            if(obj.media["media"+i] !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}
                               preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+i] + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else if (obj.media["media"+((i+1)%2)] !== null){
                if(stores_utils.getFileType(obj.media.media0) === 'video'){
                    currentAsset = (
                        <video id={"media_" + obj.uuid} key={"media_" + obj.uuid}
                               src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media["media"+((i+1)%2)] + "#t=0.1"}
                               preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}
                        />)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
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
                               preload="auto" loop={false} crossorigin="anonymous" muted={true} playsInline={true}/>)
                } else {
                    currentAsset = (<img id={"media_" + obj.uuid} key={"media_" + obj.uuid} crossorigin="Anonymous"
                                         src={`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0 + "#t=0.1"}/>)
                }
                return(currentAsset)
            }
            else return null;
        default:
            return null;
    }
}

export default {
    generateAsset: generateAsset
}