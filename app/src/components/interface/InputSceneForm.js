import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";

function InputSceneForm(props){

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
                            <label htmlFor={"scene_name"}>Nome</label>
                            <input type="text"
                                   id="scene_name"
                                   name="scene_name"
                            />
                            <label htmlFor={"scene_tag"}>Etichetta</label>
                            <select id={'scene_tag'} name={'scene_tag'} className={"custom-select"}>
                                {[...props.sceneTags.values()].map( child => (
                                    tagOption(child)
                                ))}
                            </select>
                            <label htmlFor={'select-scene-type'}>Tipo</label>
                            <div id={'select-scene-type'} name={"select-scene-name"}>
                                <input type={'radio'} name={'scene-type'} value={'3D'} defaultChecked={'true'}/>3D
                                <input type={'radio'} name={'scene-type'} value={'2D'}/>2D
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
                                    type = document.getElementById("select-scene-type").value,
                                    media = document.getElementById("imageInput").files[0],
                                    tag= JSON.parse(document.getElementById("scene_tag").value);
                                addMediaAndCreateScene(name,props.scenes._map.last()+1, type, media, tag.tagColor, tag.tagName);
                            }
                            } data-dismiss="modal" >Conferma</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

function addMediaAndCreateScene(name, index, type, media, tagColor, tagName){
    //FARE CONTROLLI FORM QUI!1!1
    //lettere accentate e spazi sono ammessi! Yay
    //MA NON ALL'INIZIO DELLA FRASE
    name = name.trim();

    // regex to extract file extension
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(media.name)[1];
    name = name + "." + ext;


    if (!SceneAPI.existsByName(name)){
        if(!index)
            index = 0;
        MediaAPI.addMedia(name, index, type, media, tagColor, tagName);

    } else {
        console.log("There's already a scene with that name!");
    }
}

function tagOption(tag){

    // AGGIUNGERE COLORE AL TAG DA SELEZIONARE
    //https://github.com/aslamswt/Responsive-Select-Dropdown-with-Images
    let tmp=JSON.stringify(tag);
    return (
        <option value={tmp} key={tmp}>{tag.tagName}</option>


    );
}

export default InputSceneForm;


