import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import FileSelectionBtn from "./FileSelectionBtn";
import Values from "../../rules/Values";
import Dropdown from "./Dropdown";

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
                                       maxLength={50}
                                       minLength={1}
                                       onChange={() => {
                                           let name = document.getElementById("scene_name").value;
                                           name.split(' ').join('_');
                                           props.newSceneNameTyped(name != "");
                                       }}
                                />
                                <div>
                                    <label htmlFor={'select-scene-type'}>Tipo:</label>
                                    <select id={'select-scene-type'}>
                                        <option value={Values.THREE_DIM}>3D</option>
                                        <option value={Values.TWO_DIM}>2D</option>
                                    </select>
                                </div>
                            </div>
                            <div className={'box-titles'}>Etichetta</div>
                            <div className={'box-grid scene-grid'}>
                                <Dropdown props={props}
                                          component={'tags-new-scene'}
                                          property={'tag'}
                                          defaultValue={props.editor.selectedTagNewScene}/>
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
                                   className={'input-new-scene ellipsis'}
                                >
                                    {selectedFile(props)}
                                </p>
                                <FileSelectionBtn {...properties} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    onClick={()=>checkFormAndCreateScene(props)} data-dismiss="modal"
                                    disabled={checkIfDisabled(props)}>Conferma</button>
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

function checkFormAndCreateScene(props){
    let name = document.getElementById("scene_name").value;
    name = name.split(' ').join('_').split('.').join('_'); //remove spaces and dots
    if(name.match(/^\d/)){
        name = "num" + name;
    }

    let media = props.editor.selectedFile,
        index = props.scenes._map.last() + 1,//TODO: che è successo qui?
        tag = props.editor.selectedTagNewScene;
    let e = document.getElementById("select-scene-type");
    let type = e.options[e.selectedIndex].value;

    if(!props.scenesNames.has(name) && media != null) {
        if(!index) index = 0;
        SceneAPI.createScene(name, media, index, type, tag, props.editor.scenesOrder, props);
        props.rightbarSelection('scene');
        props.selectFile(null);
    }
    else{
        window.alert("Attenzione, esiste già una scena con quel nome");
    }
}

function checkGlobalObject(props) {

}

function selectedFile(props){
    return props.editor.selectedFile ? props.editor.selectedFile : 'Nessun file selezionato';
}

export default InputSceneForm;


