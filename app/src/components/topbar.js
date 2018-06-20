import React from 'react';
import Popup from 'reactjs-popup';
//import ImageUploader from 'react-images-upload';
import SceneAPI from "../utils/SceneAPI";
import MediaAPI from "../utils/MediaAPI";

function TopBar(props){
    return (
        <div className={'topbar'}>
            Header
            <button onClick={() => props.switchToPlayMode()}>PLAY</button>
            <Popup trigger={<button className={"pop-button"}> Add scene</button>} modal>
                {close => (
                    <div className="modal">
                        <div className="header"> Aggiungi una scena </div>
                        <div className="content">
                                <label htmlFor={"scene_name"}>Inserisci il nome della scena</label>
                                <input type="text" id="scene_name" name="scene_name"/>
                                <label htmlFor={"image"}>Scegli una immagine</label>
                                <input type="file" name="image" id="imageInput"/>
                                <button onClick={()=>{

                                    props.addScene(document.getElementById("scene_name").value);
                                    close();
                                }
                                }>Conferma</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>

    );
}


function nonsappiamoancora(){
    //FARE CONTROLLI FORM QUI!1!1
 /* serve: nome; chiama getSceneByName per evitare duplcati, se getScene risponde not found, allora carichiamo media (addMedia), e se
 * addMedia va a buon fine aggiungiamo la scena*/
 var name= document.getElementById("scene_name"),
     media=document.getElementById("imageInput")[0].files[0];

    if (!SceneAPI.existsByName(name)){

        MediaAPI.addMedia(name, media);

    } else {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    }



}


/*
CODICE DI COSE

function getURL() {

    var img = document.getElementById('image');
    var files = img.files;

    // FileReader support
    if (files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('').src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }
}
<ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                onChange={props.onDrop(this)}
                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            />
*/

export default TopBar;