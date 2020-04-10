import React from "react";
import Immutable from "immutable";

function InputSaveForm(props) {

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
                            <div className="form-group">
                                <label htmlFor="save-name">Nome salvataggio</label>
                                <input type="text" id={"save-name"} className="form-control"
                                       aria-describedby="emailHelp"
                                       placeholder="Nome salvataggio"/>
                                <label htmlFor="save-description">Descrizione</label>
                                <textarea id={"save-description"} className="form-control"
                                       aria-describedby="????"
                                       placeholder="Descrizione salvataggio"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className="btn btn-secondary buttonConferm"
                                    onClick={() => saveForm(props) }

                                    data-dismiss="modal"
                                    >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function saveForm(props) {
    console.log(props);
    const name = document.getElementById("save-name").value;
    const description = document.getElementById("save-description").value;
    let alreadyExists = false;

    // Validazione form
    if (!name || !description) {
        alert("Completa tutti i campi");
        return;
    }
    // Controllo che non ci siano salvataggi con lo stesso nome, in caso imposto flag a true
    props.scenes.map(scene => {
        if(props.editor.debugSaves !== undefined && props.editor.debugSaves.get(scene.uuid) !== undefined){
            if(alreadyExists) return;
            let sceneSaves = props.editor.debugSaves.get(scene.uuid).toArray();

            console.log(scene.name,sceneSaves);
            sceneSaves.forEach(save => {
                if(save.saveName === name){
                    alreadyExists = true;
                }
            });
        }
    });
    if (!alreadyExists) {
        let objStateMap = new Immutable.OrderedMap(Object.keys(props.debugRunState)
                                                         .map(i => [i, props.debugRunState[i.toString()]]))
                                       .filter((k, v) => props.interactiveObjects.get(v) !== undefined);
        props.debugSave({
            saveName: name,
            saveDescription: description,
            currentScene: props.debugFromScene === undefined ? props.currentScene : props.debugFromScene,
            objectStates: objStateMap,
        });

    } else {
        alert("Il salvataggio " + name + " esiste già");
    }
}

export default InputSaveForm;