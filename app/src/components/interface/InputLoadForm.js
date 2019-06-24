import React from "react";
import Immutable from "immutable";
import EditorState from "../../data/EditorState";
import DebugAPI from "../../utils/DebugAPI";

function InputLoadForm(props){
    return(
        <div id={"register"}>
            <div className="modal fade" id="load-modal" tabIndex="-1" role="dialog" aria-labelledby="register-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="register-modal-label">Carica salvataggio scena</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Seleziona caricamento</label>
                                <div>
                                    {listSceneSaves(props, props.sceneUuid)}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm"  data-dismiss="modal"
                                    onClick={() => {
                                        //DebugAPI.loadDebugState({saveName}, "loadSave");
                                    }}>
                            Carica
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function listSceneSaves(props, sceneUuid) {
    if(EditorState.debugSaves !== null && EditorState.debugSaves !== undefined && EditorState.debugSaves[sceneUuid]) {
        let savesList = EditorState.debugSaves[sceneUuid].toArray();
        console.log(savesList);
        return savesList.map(saveName => {
                return <div>
                    <button className={"btn select-file-btn new-rule-btn"}
                            onClick={() => {
                                if (window.confirm("Vuoi caricare questo salvataggio?")) {
                                    DebugAPI.loadDebugState({saveName}, "loadSave");
                                }
                            }}
                    > {saveName}
                    </button>
                </div>
            }
        );
    }
    else
        return;
}

export default InputLoadForm;