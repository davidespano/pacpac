import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import TagDropdown from "./TagDropdown";
import FileSelectionBtn from "./FileSelectionBtn";

function InputSceneForm(props){

    let properties = {
        props : props,
        component : 'topbar',
    };

    return(
        <div id={"addSceneDiv"}>
            <div className="modal fade" id="add-scene-modal" tabIndex="-1" role="dialog" aria-labelledby="add-scene-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-scene-modal-label">Nuova Scena</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className={'box-titles'}>Nome</div>
                            <div className={'box-grid'}>
                                <input type="text"
                                       id="scene_name"
                                       name="scene_name"
                                       className={'input-new-scene'}
                                       onChange={() => {
                                           let name = document.getElementById("scene_name").value;
                                           props.newSceneNameTyped(name != "");
                                       }}
                                />
                            </div>
                            <div className={'box-titles'}>Etichetta</div>
                            <div className={'box-grid scene-grid'}>
                                <TagDropdown {...properties}/>
                                <button
                                    title={"Tag manager"}
                                    className={"select-file-btn btn"}
                                    data-toggle="modal"
                                    data-target="#add-tag-modal"
                                >
                                    <img className={"action-buttons dropdown-tags-btn-topbar btn-img"} src={"icons/icons8-tags-white-50.png"}/>
                                    Etichette
                                </button>
                            </div>
                            <div className={'box-titles'}>Media</div>
                            <div className={'box-grid scene-grid'}>
                                <p id={'file-selected-name'}
                                   className={'input-new-scene'}
                                >
                                    {selectedFile(props)}
                                </p>
                                <FileSelectionBtn {...properties} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={()=>{
                                let name = document.getElementById("scene_name").value,
                                    media = props.editor.selectedFile,
                                    tag_uuid = props.editor.selectedTagNewScene;
                                let type = "3D";
                                if(!props.scenes.has(name) && media != null) {
                                    checkFormAndCreateScene(
                                        name,
                                        media,
                                        props.scenes._map.last() + 1,
                                        type,
                                        tag_uuid,
                                        props.editor.scenesOrder,
                                    );
                                    props.rightbarSelection('scene');
                                    props.selectFile(null);
                                }
                            }
                            } data-dismiss="modal" disabled={checkIfDisabled(props)}>Conferma</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

function checkIfDisabled(props){
    return !(props.editor.selectedFile && props.editor.newSceneNameTyped);
}

function checkFormAndCreateScene(name, media, index, type, tag, order){
    name = name.trim();
    if(!index) index = 0;
    SceneAPI.createScene(name, media, index, type, tag, order);
}

function selectedFile(props){
    return props.editor.selectedFile ? props.editor.selectedFile : 'Nessun file selezionato';
}

export default InputSceneForm;


