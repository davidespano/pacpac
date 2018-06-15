import React from 'react';
import Popup from 'reactjs-popup';

function TopBar(props){
    return (
        <div className={'topbar'}>
            Header
            <button onClick={() => props.switchToPlayMode()}>PLAY</button>
            <Popup trigger={<button className={"pop-button"}> Add scene</button>} modal>
                    <div className="modal">
                        <div className="header"> Aggiungi una scena </div>
                        <div className="content">
                                <label htmlFor={"scene_name"}>Inserisci il nome della scena</label>
                                <input type="text" id="scene_name" name="scene_name"/>
                                <label htmlFor={"image"}>Scegli una immagine</label>
                                <input type="file" name="image" id="image"/>
                                <button onClick={()=>{
                                 var input=getInput();
                                 props.addScene(input.name,input.name,input.img);
                                }
                                }>Conferma</button>
                        </div>
                    </div>
            </Popup>
        </div>

    );
}

function getInput() {

    var scene_name=document.getElementById("scene_name").value;
    var img=document.getElementById("image").value;
    console.log(scene_name,img)
    return {
        name: scene_name,
        img: img,
    }
    //Aggiungere libreria per leggere l'URL dell'immagine.
}

export default TopBar;