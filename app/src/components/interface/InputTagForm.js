import React from 'react';
import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";

function InputTagForm(props){
    return(
        <div id={"addLabel"}>
            <div className="modal fade" id="add-tag-modal" tabIndex="-1" role="dialog" aria-labelledby="add-tag-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-tag-modal-label">Gestisci Etichette</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <input type={'text'} placeholder={"Cerca un'etichetta..."}/>
                            <div id={'tag-box'}>
                                {generateTags(props)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

function generateTags(props){

}

export default InputTagForm;