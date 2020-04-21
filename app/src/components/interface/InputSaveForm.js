import React from "react";
import Immutable from "immutable";

function InputSaveForm(props) {
    if(props.editor.debugRunState === undefined){
        return (
            <div id={"register"}>
                <div className="modal fade" id="save-modal" tabIndex="-1" role="dialog"
                     aria-labelledby="register-modal-label" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h5 className="modal-title" id="register-modal-label">Non ci sono modifiche</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.clear();
    console.log("props.debugRunState", props.debugRunState);
    if(props.debugRunState === undefined){
        return (
            <div id={"register"}>
                <div className="modal fade" id="save-modal" tabIndex="-1" role="dialog"
                     aria-labelledby="register-modal-label" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="register-modal-label">Non ci sono modifiche</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.clear();
    console.log("props.debugRunState", props.debugRunState);

    if(props.debugRunState === undefined){
        return (
            <div id={"register"}>
                <div className="modal fade" id="save-modal" tabIndex="-1" role="dialog"
                     aria-labelledby="register-modal-label" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="register-modal-label">Non ci sono modifiche</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={"register"}>
            <div className="modal fade" id="save-modal" tabIndex="-1" role="dialog"
                 aria-labelledby="register-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="register-modal-label">Salvataggio</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="font-weight-bold text-danger" id="error-message">
                            </div>

                            <div className="form-group">
                                <label htmlFor="save-name">Nome salvataggio</label>
                                <input type="text" id={"save-name"} className="form-control"
                                       aria-describedby="emailHelp"
                                       onChange={checkName}
                                       placeholder="Nome salvataggio"/>
                                <label htmlFor="save-description">Descrizione</label>
                                <textarea id={"save-description"}
                                          className="form-control"
                                          aria-describedby="????"
                                          onChange={validateForm}
                                          placeholder="Descrizione salvataggio"/>
                            </div>
                        </div>
                        <div className="modal-footer"
                             onMouseOver={bottomErrorMessages}
                             onMouseOut={bottomErrorMessages}
                            >
                            <button type="button"
                                    id="save-submit-button"
                                    className="btn btn-secondary buttonConferm"
                                    onClick={() =>  saveForm(props)}
                                    data-dismiss="modal"
                                    >
                                Conferma
                            </button>
                            <span id="error-message-footer" className="font-weight-bold text-danger text-right float-right p-2">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function saveForm(props) {
    console.log('fgb');
    const name = document.getElementById("save-name").value;
    const description = document.getElementById("save-description").value;

    let objStateMap = new Immutable.OrderedMap(Object.keys(props.editor.debugRunState)
        .map(i => [i, props.editor.debugRunState[i.toString()]]))
        .filter((k, v) => props.interactiveObjects.get(v) !== undefined);

    props.debugSave({
        saveName: name,
        saveDescription: description,
        currentScene: props.debugFromScene === undefined ? props.currentScene : props.debugFromScene,
        objectStates: objStateMap,
    });
}

export default InputSaveForm;