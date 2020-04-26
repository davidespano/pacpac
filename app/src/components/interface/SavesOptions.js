import React from 'react';
import Immutable from "immutable";
import DebugAPI from "../../utils/DebugAPI";
import interface_utils from "./interface_utils";
import settings from "../../utils/settings";
import InputSaveForm from "./InputSaveForm";
import ObjectsStore from "../../data/ObjectsStore";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import toString from "../../rules/toString";


const {mediaURL} = settings;

function SavesOptions(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;

    return (
        <div>
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
    let regex = RegExp('.*\.mp4$');

    return ([...props.scenes.values()].map(child => {
        let s;
        s = {border: '2px solid black'};

        let src = path + '_thumbnails_/' + child.img + (regex.test(child.img) ? ".png" : "");

        console.log("SavesOptions/debugSaves", props.editor.debugSaves);

        if(props.editor.debugSaves !== undefined && props.editor.debugSaves.get(child.uuid) !== undefined) {
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
                        <div>
                            {listSceneSaves(props, child.uuid, child.name)}
                        </div>
                    </div>
            );
        }
    }));
}

function listSceneSaves(props, sceneUuid, sceneName) {
    if(props.editor.debugSaves.get(sceneUuid)) {
        let savesList = props.editor.debugSaves.get(sceneUuid).toArray();
        return savesList.map(save => {
            return (
                <div id={"saves-list" + save.saveName} key={save.saveName} className={"saves-list"} title={"Descrizione: " + save.saveDescription} onClick={() => {

                    let load = document.getElementById("load-button" + save.saveName);
                    let list = document.getElementById("saves-list" + save.saveName);
                    
                    interface_utils.setClassStyle(".saves-list", "margin-right: -10%");
                    interface_utils.setClassStyle(".load-button", "visibility: hidden");

                    if (load != null) {
                        interface_utils.setIdStyle("load-button", save.saveName, "visibility: visible");
                        list.style = "margin-right: 36%";
                    }

                }}>
                    {save.saveName}

                    <button id={"load-button" + save.saveName} className={"select-file-btn btn load-button"} onClick={() => {
                       /* let stringa = "";
                        let obj = save.objectStates.map(os => os.uuid + " Stato: " + os.state + "; " + os.activable);
                        obj.forEach(os => { stringa += os + "\n"})
                        if (window.confirm("Vuoi caricare questo salvataggio? Gli oggetti in scena sono: \n" + stringa)) {
                            DebugAPI.loadDebugState(save.saveName);
                        }*/
                    }} data-toggle="modal" data-target={"#load-save-modal" + save.saveName}>
                        Carica
                    </button>
                    <LoadDebugSave key={save.saveName} {...{sceneName: sceneName, save: save, ...props}} />
                </div>

            );
        });
    }
    else
        return;
}

function LoadDebugSave({sceneName, save, ...props}){

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
                                            <tr>
                                                <th>Tipo</th>
                                                <th>Nome</th>
                                                <th>Stato</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                                {/* Per ogni oggetto salvato viene creata una riga nella tabella dello stato degli oggetti*/
                                                    save.objectStates.map(obj => {
                                                    /* Questo controllo è per evitare che nuovi salvataggi, alla cui scena sono stati inseriti nuovi oggetti, diano errore*/
                                                    if(props.interactiveObjects.get(obj.uuid) === undefined)
                                                        return <></>;

                                                    let state = obj.state ? toString.valueUuidToString(obj.state) : "" ; // Proprietà di key e switch
                                                    let step = obj.step ? "Valore iniziale: " + obj.step : ""; // Proprietà di counter

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
                                    onClick={() => DebugAPI.loadDebugState(save.saveName) }
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