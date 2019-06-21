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
                        var i

                        let objStateMap = new Immutable.OrderedMap(Object.keys(EditorState.debugRunState)
                            .map(i => [i, EditorState.debugRunState[i.toString()]]))
                            .filter((k,v) =>props.interactiveObjects.get(v) !== undefined);
                        console.log(objStateMap);
                        DebugAPI.saveDebugState(props.currentScene, objStateMap);

                        for(i = 0; i < saveDivs.length; i++) {
                            if(saveDivs[i].children[1].alt === props.scenes.get(props.currentScene).name) {
                                //document.getElementsByClassName('save-img')[i].setAttribute("style", "display: block");
                                /*
                                let objStateMap = new Immutable.OrderedMap(Object.keys(EditorState.debugRunState)
                                    .map(i =>
                                        [i, new Immutable.Record({
                                            uuid: i,
                                            properties: EditorState.debugRunState[i.toString()],
                                        })])).filter((k,v) =>props.interactiveObjects.get(v) !== undefined);
                                * */
                            }

                        }
                    }}>
                Salva
            </button>
        </div>

    )
}

export default SavesOptions;