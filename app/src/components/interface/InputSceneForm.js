import React from 'react';
import MediaAPI from "../../utils/MediaAPI";
import SceneAPI from "../../utils/SceneAPI";
import TagDropdown from "./TagDropdown";

function InputSceneForm(props){

    let properties = {
        props : props,
        component : 'topbar',
    }

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
                            />
                            <label>Etichetta</label>
                            <TagDropdown {...properties}/>
                            <label htmlFor={'select-scene-type'}>Tipo</label>
                            <div id={'select-scene-type'} name={"select-scene-name"}>
                                <input id={'scene-type-3d'} type={'radio'} name={'scene-type'} value={'3D'} defaultChecked={'checked'}/>3D
                                <input id={'scene-type-2d'} type={'radio'} name={'scene-type'} value={'2D'}/>2D
                            </div>
                            <label htmlFor={"image"}>Media</label>
                            <input type="file"
                                   name="image"
                                   id="imageInput"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={()=>{
                                let name = document.getElementById("scene_name").value,
                                    media = document.getElementById("imageInput").files[0],
                                    tag_uuid = props.editor.selectedTagNewScene;
                                let type = (document.getElementById("scene-type-3d").checked)? '3D' : '2D';
                                if(!props.scenes.has(name)) {
                                    addMediaAndCreateScene(name,
                                        props.scenes._map.last() + 1,
                                        type,
                                        media,
                                        tag_uuid,
                                        props.editor.scenesOrder,
                                    );
                                    props.rightbarSelection('scene');
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

function addMediaAndCreateScene(name, index, type, media, tag, order){
    //FARE CONTROLLI FORM QUI!1!1
    //lettere accentate e spazi sono ammessi! Yay
    //MA NON ALL'INIZIO DELLA FRASE
    name = name.trim();

    // regex to extract file extension
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(media.name)[1];
    name = name + "." + ext;

    if(!index) index = 0;

    MediaAPI.addMediaScene(name, index, type, media, tag, order);
}

export default InputSceneForm;


