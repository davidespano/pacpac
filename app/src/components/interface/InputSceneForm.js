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
                        <label htmlFor={"scene_name"}>Etichetta</label>
                        <input type="color"
                               id="scene_label"
                               name="scene_label"
                               value ='#000000'
                        />
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

function setColorPicker(sceneLabels, colorPicker){

    if(colorPicker){
        colorPicker.spectrum({
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            color: 'blanchedalmond',
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ]
        })
    }
}

export default InputSceneForm;