import React from 'react';
import Popup from 'reactjs-popup';
//import ImageUploader from 'react-images-upload';

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
                                <input type="file" name="image" id="image"/>
                                <button onClick={()=>{
                                    var input=getInput();
                                    props.addScene(input.name,input.name, input.img);
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

function getInput() {

    var scene_name = document.getElementById("scene_name").value;
    var img = document.getElementById("image").value;
    console.log(scene_name, img);
    //getURL();
    return {
        name: scene_name,
        img: img,
        //Aggiungere libreria per leggere l'URL dell'immagine.
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