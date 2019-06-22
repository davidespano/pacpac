import React from 'react';
import Leftbar from './Leftbar';
import Immutable from "immutable";
import EditorState from "../../data/EditorState";
import DebugAPI from "../../utils/DebugAPI";

function SavesOptions(props) {
    return(
        <div>
            <h4>SALVATAGGIO</h4>
            <button className={"btn select-file-btn new-rule-btn"}
                    onClick={() => {
                        let saveDivs = document.getElementsByClassName('save-img');

                        let objStateMap = new Immutable.OrderedMap(Object.keys(EditorState.debugRunState)
                            .map(i => [i, EditorState.debugRunState[i.toString()]]))
                            .filter((k,v) =>props.interactiveObjects.get(v) !== undefined);

                        DebugAPI.saveDebugState(props.currentScene, objStateMap);

                        for(let i = 0; i < saveDivs.length; i++) {
                            if(saveDivs[i].children[1].alt === props.scenes.get(props.currentScene).name) {
                                //document.getElementsByClassName('save-img')[i].setAttribute("style", "display: block");
                            }

                        }
                    }}>
                Salva
            </button>
            <br/><br/>
            <button className={"btn select-file-btn new-rule-btn"}
                    onClick={() => {
                        DebugAPI.loadDebugState();
                    }}
            > Carica</button>
        </div>

    )
}

export default SavesOptions;