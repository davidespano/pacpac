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

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    onClick={() => {alert("caricamento")}} data-dismiss="modal">Carica</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputLoadForm;