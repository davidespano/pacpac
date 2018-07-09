import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";

function InputSceneForm(props){

    return(
        <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            AddScene
        </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Aggiungi Scena</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor={"scene_name"}>Inserisci il nome della scena</label>
                            <input type="text"
                                   id="scene_name"
                                   name="scene_name"
                            />
                            <label htmlFor={"scene_tag"}>Etichetta</label>
                            <select id={'scene_tag'} name={'scene_tag'}>
                                {[...props.sceneTags.values()].map( child => (
                                    tagOption(child)
                                ))}
                            </select>
                            <label htmlFor={"image"}>Scegli un'immagine</label>
                            <input type="file"
                                   name="image"
                                   id="imageInput"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-secondary" onClick={()=>{
                                let name = document.getElementById("scene_name").value,
                                    media = document.getElementById("imageInput").files[0],
                                    tag= JSON.parse(document.getElementById("scene_tag").value);
                                addMediaAndCreateScene(name, media,tag.tagColor,tag.tagName);
                            }
                            } data-dismiss="modal" >Conferma</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

function addMediaAndCreateScene(name, media,tagColor,tagName){
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

        MediaAPI.addMedia(name, media,tagColor,tagName);

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


