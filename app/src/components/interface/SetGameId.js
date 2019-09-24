import React from 'react';
import interface_utils from "./interface_utils";
import Actions from "../../actions/Actions";
import SceneAPI from "../../utils/SceneAPI";
import MediaAPI from "../../utils/MediaAPI";
import AudioAPI from "../../utils/AudioAPI";

function SetGameId(props){

    return(
        <div id={"setGameId"}>
            <div className="modal fade" id="gameId-modal" tabIndex="-1" role="dialog" aria-labelledby="gameId-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="gameId-modal-label">Gioca</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="form-group">
                                <label className={'box-titles'} htmlFor="inputGame">Codice gioco</label>
                                <input type="text" className="form-control" id="inputGame" name={'inputGame'}
                                       placeholder="000000000000000000000000000000000"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    onClick={() => submitGame()} data-dismiss="modal">Play</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function submitGame(){
    let gameId = document.getElementById('inputGame').value;

    if(gameId.length === 32) {
        SceneAPI.getHomeScene(null, gameId);
        SceneAPI.getAllScenesAndTags(null, gameId);
        MediaAPI.getAllAssets(null, gameId);
        AudioAPI.getAllAudios(null, gameId);
        Actions.playModeOn(gameId);
    } else {
        alert('Codice non valido!');
    }
}

export default SetGameId;