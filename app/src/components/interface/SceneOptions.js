import React from 'react';
import scene_utils from "../../scene/scene_utils";
import stores_utils from "../../data/stores_utils";
import interface_utils from "./interface_utils";
import Orders from "../../data/Orders";
import FileSelectionBtn from "./FileSelectionBtn";
import Dropdown from "./Dropdown";
import SceneAPI from "../../utils/SceneAPI";
import Actions from "../../actions/Actions";
import SceneCopy from "./SceneCopy";

function SceneOptions(props){

    let properties = {
        props : props,
        component : 'rightbar',
    };

    if(props.currentScene){
        let currentScene = props.scenes.get(props.currentScene);
        let sceneOptions = props.editor.sceneOptions;

        return(
            <div className={'currentOptions'}>
                <SceneCopy {...props}/>
                <div>
                    <div className={"buttonGroup buttonGroup-bar"}>
                        <button
                        title={"Elimina la scena corrente"}
                        className={"action-buttons-container"}
                        onClick={() => {
                            checkAndRemoveScene(props, currentScene);
                        }}
                    >
                        <img className={"action-buttons scene-buttons-img"} src={"icons/icons8-waste-50.png"}/>
                    </button>
                    <button
                        title={"Copia la scena corrente"}
                        className={"action-buttons-container"}
                        data-toggle="modal"
                        data-target="#scene-copy-modal"
                    >
                        <img className={"action-buttons scene-buttons-img"} src={"icons/icons8-copia-50.png"}/>
                        Copia
                    </button>
                    </div>
                </div>
                <label className={'rightbar-titles'}>Nome e tipologia</label>
                <div className={'rightbar-grid'}>
                    <input id={"sceneName"}
                           className={"propertyForm rightbar-box"}
                           value={sceneOptions.name}
                           maxLength={50}
                           onChange={(e) => {
                               let value = e.target.value;
                               sceneOptions = sceneOptions.set('name', value);
                               props.updateSceneOptions(sceneOptions);
                           }}
                           onBlur={() => {
                               if(sceneOptions.name !== currentScene.name && sceneOptions.name !== ''){
                                   scene_utils.setProperty(currentScene, 'name', sceneOptions.name, props);
                               }
                           }}
                    />
                    <div>
                        <Dropdown props={props}
                                  component={'scene-type'}
                                  property={'type'}
                                  defaultValue={currentScene.type}/>
                    </div>
                    <div className={'rightbar-checkbox'}>
                        <input type={'checkbox'} className={'checkbox-audio-form'}
                               id={'home-scene'} checked={props.editor.homeScene === props.currentScene}
                               onChange={() => {
                                   SceneAPI.setHomeScene(props.currentScene);
                               }}
                        />
                        <label htmlFor={'home-scene'}>Scena iniziale</label>
                    </div>
                </div>
                <label className={'rightbar-titles'}>Etichetta</label>
                <div className={'rightbar-grid'}>
                    <Dropdown props={props}
                              component={'tags-edit-scene'}
                              property={'tag'}
                              defaultValue={currentScene.tag}/>
                    <button
                        title={"Gestisci etichette"}
                        className={"select-file-btn btn"}
                        data-toggle="modal"
                        data-target="#add-tag-modal"
                    >
                        <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-tags-white-50.png"}/>
                    </button>
                </div>
                <label htmlFor={'select-file-scene'} className={'rightbar-titles'}>File</label>
                <div className={'rightbar-grid'}>
                    <div id={'select-file-scene'}>
                        <p className={'file-selected-name propertyForm ellipsis-no-inline'}>{sceneOptions.img}</p>
                    </div>
                    <FileSelectionBtn {...properties} />
                    {getVideoOptions(currentScene, sceneOptions, props)}
                </div>
                <label className={'rightbar-titles'}>Audio spaziali</label>
                {spatialAudioList(props, currentScene)}
                <label className={'rightbar-titles'}>Musica di sottofondo</label>
                <Dropdown
                    props={props}
                    component={'music'}
                    property={'music'}
                    defaultValue={currentScene.music}
                />
                <label className={'rightbar-titles'}>Effetti sonori d'ambiente</label>
                <Dropdown
                    props={props}
                    component={'sfx'}
                    property={'sfx'}
                    defaultValue={currentScene.sfx}
                />
            </div>
        );
    } else {
        return(
            <div>Nessuna scena selezionata</div>
        );
    }
}

/**
 * If the scene file is a video, returns video options
 * @param currentScene
 * @param sceneOptions
 */
function getVideoOptions(currentScene, sceneOptions, props){
    let type = stores_utils.getFileType(currentScene.img);

    if(type === 'video'){
        let isAudioOn = sceneOptions.isAudioOn;
        let isVideoInALoop = sceneOptions.isVideoInALoop;
        return <React.Fragment>
            <div className={'rightbar-checkbox'}>
                <input type={'checkbox'} className={'checkbox-audio-form'}
                       id={'sound-active-rightbar-checkbox'} checked={isAudioOn}
                       onChange={() => {
                           sceneOptions = sceneOptions.set('isAudioOn', !isAudioOn);
                           props.updateSceneOptions(sceneOptions);
                           scene_utils.setProperty(currentScene, 'isAudioOn',!isAudioOn, props);
                       }}
                />
                <label htmlFor={'sound-active-rightbar-checkbox'}>Riproduci l'audio</label>
                <div> </div>
                <input type={'checkbox'} className={'checkbox-audio-form'}
                       id={'video-loop-rightbar-checkbox'} checked={isVideoInALoop}
                       onChange={() => {
                           sceneOptions = sceneOptions.set('isVideoInALoop', !isVideoInALoop);
                           props.updateSceneOptions(sceneOptions);
                           scene_utils.setProperty(currentScene, 'isVideoInALoop',!isVideoInALoop, props);
                       }}
                />
                <label htmlFor={'video-loop-rightbar-checkbox'}>Riproduci in loop</label>
            </div>
        </React.Fragment>
    }

    return null;
}

/**
 * Generates spatial audio list
 * @param props
 * @param scene
 * @returns {*}
 */
function spatialAudioList(props, scene){
    let audioRendering;
    let audios = scene.get('audios').map(a => props.audios.get(a)).sort(stores_utils.chooseComparator(Orders.ALPHABETICAL));

    if(scene.audios.length > 0) {
        audioRendering = audios.map(audio => {
            return (
                <p className={'audio-list-element ' + checkSelection(props, audio.uuid)}
                   key={'audio-list-element-' + audio.uuid}
                   onClick={() => interface_utils.audioSelection(props, audio)}>
                    {audio.name}
                </p>
            );
        });
    } else {
        audioRendering = <p className={'no-audio'}>Nessun audio spaziale</p>
    }


    return (
        <React.Fragment>
            <div className={'audio-list-box-btns'}>
                <button
                    title={"Gestisci audio"}
                    className={"select-file-btn btn"}
                    data-toggle="modal"
                    data-target="#manage-audio-modal"
                >
                    <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-white-audio-50.png"}/>
                </button>
                <button
                    title={"Modifica audio"}
                    className={"action-buttons-container"}
                    data-toggle="modal"
                    data-target="#audio-form-modal"
                    disabled={props.editor.audioToEdit == null}
                    onClick={() => {
                        props.isItNew(false);
                    }}
                >
                    <img className={"action-buttons"} src={"icons/icons8-pencil-50.png"} alt={'Modifica'}/>
                </button>
                <button
                    title={"Cancella audio"}
                    className={"action-buttons-container"}
                    onClick={() => {
                        props.removeAudio(props.editor.audioToEdit);
                    }}
                    disabled={props.editor.audioToEdit == null}
                >
                    <img className={"action-buttons"} src={"icons/icons8-waste-50.png"} alt={'Modifica'}/>
                </button>
            </div>
            <div className={'audio-list-box'}>
                {audioRendering}
            </div>
        </React.Fragment>
    );
}

function checkSelection(props, uuid){
    if(props.editor.audioToEdit && props.editor.audioToEdit.uuid === uuid){
        return 'selected-audio';
    }
    return '';
}

/**
 * checks if author wants to remove the scene, if positive the scene is removed and homeScene and currentScene are
 * updated accordingly
 * @param props
 * @param scene
 */
function checkAndRemoveScene(props, scene){
    let answer = window.confirm('Vuoi rimuovere la scena? Verranno rimossi tutti gli oggetti, regole e audio ad essa collegati.');
    if(answer){
        props.removeScene(scene);
        let scenes = props.scenes.delete(scene.uuid);
        let first = scenes.first(); // take the first of the remaining scenes, if valid set as currentScene
        Actions.updateCurrentScene(first ? first.uuid : null);

        if(props.editor.homeScene === scene.uuid){ // handle deleting homeScene
            first ? SceneAPI.setHomeScene(first.uuid) : Actions.setHomeScene(null);
        }
    }
}

export default SceneOptions;