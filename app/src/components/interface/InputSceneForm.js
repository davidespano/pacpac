import React from 'react';
import MediaAPI from "../../utils/MediaAPI";
import SceneAPI from "../../utils/SceneAPI";
import TagDropdown from "./TagDropdown";
import FileForm from "./FileForm";
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
                            <label>Nome</label>
                            <input type="text"
                                   id="scene_name"
                                   name="scene_name"
                                   className={'input-new-scene'}
                            />
                            <label>Etichetta</label>
                            <TagDropdown {...properties}/>
                            <label htmlFor={"image"}>Media</label>
                            <div id={'select-file-container'} name="image">
                                <p id={'file-selected-name'}
                                   className={'input-new-scene'}
                                >
                                    {selectedFile(props.editor)}
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
                            } data-dismiss="modal" >Conferma</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

function checkFormAndCreateScene(name, media, index, type, tag, order){
    //FARE CONTROLLI FORM QUI!1!1
    //lettere accentate e spazi sono ammessi! Yay
    //MA NON ALL'INIZIO DELLA FRASE
    name = name.trim();

    // regex to extract file extension
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    //let re = /(?:\.([^.]+))?$/;
    //let ext = re.exec(media.name)[1];
    //name = name + "." + ext;

    if(!index) index = 0;

    SceneAPI.createScene(name, media, index, type, tag, order);
}

function selectedFile(editor){
    return editor.selectedFile ? editor.selectedFile : 'No file selected';
}


export default InputSceneForm;


