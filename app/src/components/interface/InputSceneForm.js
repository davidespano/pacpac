import React from 'react';
import Popup from 'reactjs-popup';
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";

function InputSceneForm(props){

    return(
        <Popup trigger={<button className={"pop-button"}> Add scene </button>} modal>
            {close => (
                <div className="modal">
                    <div className="header"> Aggiungi una scena </div>
                    <div className="content">
                        <label htmlFor={"scene_name"}>Inserisci il nome della scena</label>
                        <input type="text"
                               id="scene_name"
                               name="scene_name"
                        />
                        <label htmlFor={"scene_label"}>Etichetta</label>
                        <select id={'scene_label'} name={'scene_label'}>
                            {[...props.sceneLabels.values()].map( child => (
                                <option key={child.title}>
                                    {child.title}
                                </option>
                            ))}
                        </select>
                        <label htmlFor={"image"}>Scegli un'immagine</label>
                        <input type="file"
                               name="image"
                               id="imageInput"
                        />
                        <button onClick={()=>{
                            let name= document.getElementById("scene_name").value,
                                media=document.getElementById("imageInput").files[0];

                            addMediaAndCreateScene(name, media);
                            close();
                        }
                        }>Conferma</button>
                    </div>
                </div>
            )}
        </Popup>
    );
}

function addMediaAndCreateScene(name, media){
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

        MediaAPI.addMedia(name, media);

    } else {
        console.log("There's already a scene with that name!");
    }
}

export default InputSceneForm;