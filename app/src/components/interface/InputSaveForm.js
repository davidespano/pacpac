import React from "react";
import Immutable from "immutable";
import EditorState from "../../data/EditorState";
import DebugAPI from "../../utils/DebugAPI";

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
                                <label htmlFor="exampleInputEmail1">Nome salvataggio</label>
                                <input type="text" id={"save-name"} className="form-control"
                                       aria-describedby="emailHelp"
                                       placeholder="Nome salvataggio"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm"
                                    onClick={() => saveForm(props)} data-dismiss="modal">Conferma
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function saveForm(props) {
    const name = document.getElementById("save-name").value;
    let flag = false;


    if (!name) {
        alert("Completa tutti i campi");
        return;
    }

    props.scenes.map(scene => {
        if(EditorState.debugSaves !== undefined && EditorState.debugSaves[scene.uuid] !== undefined && EditorState.debugSaves[scene.uuid].get(name) !== undefined) {
            flag = true;
            return;
        }
    });

    if (!flag) {
        let objStateMap = new Immutable.OrderedMap(Object.keys(EditorState.debugRunState)
            .map(i => [i, EditorState.debugRunState[i.toString()]]))
            .filter((k, v) => props.interactiveObjects.get(v) !== undefined);

        console.log(EditorState.debugFromScene + " " + props.currentScene);
        DebugAPI.saveDebugState(name, EditorState.debugFromScene === undefined ? props.currentScene : EditorState.debugFromScene, objStateMap);
        //DebugAPI.getAllSaves();
    } else {
        alert("Salvataggio già presente");
    }


}

export default InputSaveForm;