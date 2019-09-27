import React from 'react';
import interface_utils from "./interface_utils";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import AudioAPI from "../../utils/AudioAPI";
import scene_utils from "../../scene/scene_utils";
import Scene from "../../scene/Scene";
import ScenesStore from "../../data/ScenesStore";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
let uuid = require('uuid');

function SceneCopy(props){

    return(
        <div id={"scene-copy"}>
            <div className="modal fade" id="scene-copy-modal" tabIndex="-1" role="dialog" aria-labelledby="scene-copy-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="scene-copy-modal-label">Copia</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="form-group">
                                <label className={'box-titles'} htmlFor="input-scene-copy">Nome della copia</label>
                                <input type="text" className="form-control" id="input-scene-copy" name={'inputSceneCopy'}
                                       maxLength={50}
                                       minLength={1}
                                       onChange={() => {
                                           let name = document.getElementById("input-scene-copy").value;
                                           props.newSceneCopyNameTyped(name !== "");
                                       }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" data-dismiss="modal"
                                    onClick={() => createCopy(props)}
                                    disabled={!props.editor.newSceneCopyNameTyped}
                            >
                                Crea una copia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function createCopy(props){
    let name = document.getElementById("input-scene-copy").value;
    name = name.trim().replace(' ', '_').replace('.', '_'); //remove spaces and dots
    if(name.match(/^\d/)){
        name = "num" + name;
    }

    if(props.scenesNames.has(name)){
        alert('Esiste già una scena con questo nome!');
        return;
    }

    let sceneId = uuid.v4();
    let index = props.scenes._map.last() + 1;

    //copia scena
    let currentScene = props.scenes.get(props.currentScene);
    let sceneCopied = Scene({
        uuid: sceneId,
        name : name,
        img : currentScene.img,
        type : currentScene.type,
        index : index,
        tag : currentScene.tag,
        rules: [],
        audios: [],
        objects: {
            transitions: [],
            switches: [],
            collectable_keys: [],
            locks: [],
            points: [],
            counters: [],
        }
    });
    SceneAPI.createScene(sceneCopied.name, sceneCopied.img, index, sceneCopied.type, sceneCopied.tag, props.editor.scenesOrder, sceneCopied.uuid);

    //copia oggetti
    let [objects, uuids] = objectsCopy(scene_utils.allObjects(currentScene), props);

    for(let i = 0; i < objects.length; i++){
        let obj = objects[i];
        let field = scene_utils.defineField(obj);
        let array = sceneCopied.objects;
        array[field].push(uuids[i]);
        sceneCopied = sceneCopied.set('objects', array);
        props.updateObject(obj);
        props.setObjToScene(sceneCopied.uuid, obj.uuid);
        InteractiveObjectAPI.saveObject(sceneCopied, obj);

    }

    props.updateScene(sceneCopied);

}

function objectsCopy(objects_array, props){
    let objects_uuids = [];
    let objects = [];
    objects_array.map(obj => {
        let id = uuid.v4();
        objects_uuids.push(id);
        obj = props.interactiveObjects.get(obj);
        obj = obj.set('name', obj.name + '_copia').set('uuid', id);
        objects.push(obj);
    });

    return [objects, objects_uuids];
}

export default SceneCopy;