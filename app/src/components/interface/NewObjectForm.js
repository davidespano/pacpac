import React from 'react';
import Popup from "reactjs-popup";

/**TO DO:: Aggiungere elenco di oggetti (per il nome delle opzioni e per il controllo)**/

function NewObjectForm(props){

    return(
        <Popup trigger={<button className={"pop-button"} id={'newObjectButton'}> </button>} modal>
            {close => (
                <div className="modal">
                    <div className="header"> Aggiungi un nuovo oggetto </div>
                    <div className="content">

                        <label htmlFor={"object_type"}>Tipologia</label>
                        <select id={'objectSelectionOptions'}
                                defaultValue={'---'}
                                onChange={() => {
                                    let objectType = document.getElementById('objectSelectionOptions').value;
                                    showOptions(objectType);
                                }}>
                            <option>---</option>
                            <option>Transizione</option>
                        </select>

                        <div id={'additionalOptions'}> </div>

                        <button onClick={()=>{
                            close();
                        }
                        }>Conferma</button>
                    </div>
                </div>
            )}
        </Popup>
    );
}

function showOptions(objectType){

    console.log('?????');

    //if element isn't undefined
    if(objectType){

        //clean div additionalOptions
        let additionalOptions = document.getElementById('additionalOptions');
        while (additionalOptions.firstChild) {
            additionalOptions.removeChild(additionalOptions.firstChild);
        }

        switch(objectType) {
            case 'Transizione':
                console.log('aaaay caramba');
                let newHTML = document.createElement('p');
                newHTML.innerHTML = 'Transizione woooooo';

                additionalOptions.appendChild(newHTML);
                break;
            default:
                break;
        }
    }
}

function transitionOptions(){

}

export default NewObjectForm;