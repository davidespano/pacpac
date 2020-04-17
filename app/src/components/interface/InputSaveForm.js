import React from "react";
import Immutable from "immutable";

function InputSaveForm(props) {
    console.clear();
    console.log("props.debugRunState", props.debugRunState);
    if(props.debugRunState === undefined){
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

    //Recupero gli elementi del form
    let submitButton = document.getElementById('save-submit-button');
    let nameField = document.getElementById('save-name');
    let descriptionField = document.getElementById('save-description');
    let errorMessageNotValidName = document.getElementById('error-message');
    let errorMessageFields = document.getElementById('error-message-footer');

    let flagValidName = false; // flag per dire se il nome inserito dall'utente è valido o meno (quindi se è un nome che già esiste o meno)

    let validateForm = () => {
        // Il bottone è abilitato solo se il entrambi i campi di input sono stati compilati e se il nome è valido
        //submitButton.disabled = !(nameField.value !== '' && descriptionField.value !== '' && flagValidName);

        if(!(nameField.value !== '' && descriptionField.value !== '' && flagValidName)){
            /*submitButton.disabled = true;
            submitButton.className.replace('disabled', '');*/
            submitButton.setAttribute('disabled', 'true');
        } else {
           /* submitButton.disabled = false;
            submitButton.className += " disabled";*/
           submitButton.removeAttribute('disabled');
        }
    };
    let checkName = () => {
        let name = nameField.value;
        let alreadyExists = false;

        // Controllo che non ci siano salvataggi con lo stesso nome, in caso imposto flag a true
        props.scenes.map(scene => {
            if(props.editor.debugSaves !== undefined && props.editor.debugSaves.get(scene.uuid) !== undefined){
                if(alreadyExists) return;
                let sceneSaves = props.editor.debugSaves.get(scene.uuid).toArray();

                sceneSaves.forEach(save => {
                    if(save.saveName === name){
                        alreadyExists = true;
                    }
                });
            }
        });
        errorMessageNotValidName.innerHTML = alreadyExists ? 'Esiste già un salvataggio con nome ' + name : '';
        flagValidName = !alreadyExists;
        validateForm();
    };
    let bottomErrorMessages = () => {
        errorMessageFields.innerHTML = submitButton.disabled === true ? 'Compila tutti i campi correttamente' : '';
    };

    let clearForm = () => {
        errorMessageNotValidName.innerHTML = '';
        errorMessageFields.innerHTML = '';
        nameField.value = "";
        descriptionField.value = "";
    };

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
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={() => clearForm()}>
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
                                    onClick={() => {saveForm(props); clearForm()}}
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
    console.log(props);
    const name = document.getElementById("save-name").value;
    const description = document.getElementById("save-description").value;

    let sceneUuid = props.debugFromScene === undefined ? props.currentScene : props.debugFromScene;
    let currentSceneObj = Object.values(props.scenes.get(sceneUuid).objects).flat();

    let objStateMap = new Immutable.OrderedMap(Object.keys(props.editor.debugRunState)
                                                     .map(i => [i, props.editor.debugRunState[i.toString()]]))
        .filter((k, v) => props.interactiveObjects.get(v) !== undefined  && currentSceneObj.includes(v))
        .map((v, k) => Object({uuid: k, ...v}))
        .toArray();

    props.debugSave({
        saveName: name,
        saveDescription: description,
        currentScene: sceneUuid,
        objectStates: objStateMap,
    });
    
}

export default InputSaveForm;