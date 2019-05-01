import React from 'react';
import GameAPI from "../../utils/GameAPI";

function InputGameForm(props){
    return(
        <div id={"new-game"}>
            <div className="modal fade" id="add-game-modal" tabIndex="-1" role="dialog" aria-labelledby="add-game-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-game-modal-label">Nuovo Gioco</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <label>Nome</label>
                            <input type="text"
                                   id="game_name"
                                   name="game_name"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={()=> {
                                const name = document.getElementById("game_name").value;
                                if(name && name !== ""){
                                    GameAPI.createGame(name).catch(err => {
                                        alert("Errore creazione gioco!");
                                        console.log(err);
                                    });
                                }
                            }
                            } data-dismiss="modal">Conferma</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputGameForm;