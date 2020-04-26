import React from 'react';
import Immutable from "immutable";
import DebugAPI from "../../utils/DebugAPI";
import interface_utils from "./interface_utils";
import settings from "../../utils/settings";
import InputSaveForm from "./InputSaveForm";
import ObjectsStore from "../../data/ObjectsStore";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import toString from "../../rules/toString";
import Orders from "../../data/Orders";


const {mediaURL} = settings;

function SavesOptions(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div>
            <div className={'currentOptions'}>
                <div className={"buttonGroup"}>
                    <input type={'text'} id={'debug-save-filter-text'} placeholder={'Filtra per nome...'}
                           onChange={() => {
                               let filter = document.getElementById('debug-save-filter-text').value;
                               props.updateDebugSaveNameFilter(filter);
                           }}/>
                </div>
            </div>
            {listSaves(props, path)}
        </div>

    )
}

/**
 * Generates saves list
 * @param props
 * @param path
 * @returns {any[]}
 */
function listSaves(props, path) {
    let regex = RegExp('.*\.mp4$|.MOV$');

    /* Controlla che nei salvataggi passati ci sia almeno un salvataggio che nel nome includa la stringa filter */
    let checkFilter = (saves, filter) => {
        let names = saves.toArray().map(save => save.saveName);

        for (let name of names)
            if(name.includes(filter))
                return true;

        // Nessun salvataggio contiene filter nel suo nome
        return false;
    };
    return ([...props.scenes.values()].map(child => {
        let s;
        s = {border: '2px solid black'};

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img) ? ".png" : "");

        if(props.editor.debugSaves != undefined && props.editor.debugSaves.get(child.uuid) !== undefined) {
            if(checkFilter(props.editor.debugSaves.get(child.uuid), props.editor.debugSavesFilter))
                return (
                    <div key={child.name} className={'node_element'}>
                        <h6>Salvataggi: {child.name}</h6>
                        <img
                            src={src}
                            className={'list-saves-img'}
                            alt={child.name}
                            title={interface_utils.title(child.name, props.tags.get(child.tag.name))}
                            style={s}
                        />
                        <div className="s">
                            {listSceneSaves(props, child.uuid, child.name)}
                        </div>
                    </div>
                );
        }
    }));
}

function listSceneSaves(props, sceneUuid, sceneName) {
    let savesList = props.editor.debugSaves.get(sceneUuid);

    //Se non ci sono salvataggi, non mostra niente
    if(savesList === undefined)
        return;

    return savesList.toArray().map(save => {
        //Se il nome del salvataggio rispetta le ricerche del filtro dei salvatggi viene renderizzato il salvataggio
        if(save.saveName.includes(props.editor.debugSavesFilter))
            return (
                <div id={"saves-list" + save.saveName}
                     key={save.saveName + "_li"}
                     className="d-flex justify-content-between align-items-center saves-list"
                     title={`Nome: ${save.saveName}\nDescrizione: ${save.saveDescription}`}
                     data-toggle="modal"
                     data-target={"#load-save-modal" + save.saveName}
                >
                    {save.saveName}
                    <LoadDebugSave {...{sceneName: sceneName, save: save, ...props }} />
                    <div id={"load-button" + save.saveName}
                         className="btn load-buttons badge badge-primary badge-pill">info</div>
                </div>

            );
    });
}

function LoadDebugSave({sceneName, save, ...props}){
    // Finestra riepilogativa dei dati di un salvataggio, compreso di pulsante per caricarlo
    return (
        <div id={"register"} title="">
            <div className="modal fade" id={"load-save-modal" + save.saveName} tabIndex="-1" role="dialog"
                 aria-labelledby="register-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title" id="register-modal-label">
                                Scena di riferimento:
                                <span className="h5" >{" " + sceneName}</span>
                            </h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className="form-group row">
                                <label htmlFor="sceneRef" className="col-sm-2 col-form-label">Nome Salvataggio</label>
                                <div className="col-sm-10">
                                    <p
                                        className="text-left list-group-item list-group-item-action font-weight-bold"
                                        id="inputPassword3" >{save.saveName}</p>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Descrizione</label>
                                <div className="col-sm-10">
                                    <p
                                        className="text-left list-group-item list-group-item-action"
                                        id="inputPassword3" >{save.saveDescription}</p>
                                </div>
                            </div>
                            <div className="form.group row">
                                <label htmlFor="saveObjsState" className="col-form-label col-sm-auto">Stato degli oggetti</label>
                                <div className="col-sm-12 text-left" id="saveObjsState">
                                    <table className="form-control-plaintext table table-borderless table-hover">
                                        <thead>
                                        <tr className="f">
                                            <th className="th-sm">Tipo</th>
                                            <th className="th-sm">Nome</th>
                                            <th className="th-sm">Stato</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {/* Per ogni oggetto salvato viene creata una riga nella tabella dello stato degli oggetti*/
                                            save.objectStates.map(obj => {
                                                /* Questo controllo è per evitare bug con eventuali oggetti eliminati in seguito al salvataggio */
                                                if(props.interactiveObjects.get(obj.uuid) === undefined)
                                                    return;

                                                let state = obj.state ? toString.valueUuidToString(obj.state) : "" ; // Proprietà di key e switch
                                                let step = obj.step ? "Valore iniziale: " + obj.step : ""; // Proprietà di counter

                                                /* 1a col: anteprima oggetto; 2a: nome; 3a col: proprietà */
                                                return (
                                                    <tr key={obj.uuid}>
                                                        <td className="col-md-1">
                                                            <img className="icon-obj-left"
                                                                 src={interface_utils.getObjImg(props.interactiveObjects.get(obj.uuid).type)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {props.interactiveObjects.get(obj.uuid).name}
                                                        </td>
                                                        <td>
                                                            <ul className="list-unstyled">
                                                                <li className="font-weight-bold">{state}</li>
                                                                <li className="font-weight-bold">{step}</li>
                                                                <li>{toString.valueUuidToString(obj.visible)}</li>
                                                                <li>{toString.valueUuidToString(obj.activable)}</li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                )})
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className="btn btn-secondary buttonConferm "
                                    onClick={() => {DebugAPI.loadDebugState(save.saveName);} }
                                    data-dismiss="modal"
                            >
                                Carica salvataggio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default SavesOptions;
