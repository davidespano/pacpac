import React from 'react';
import FileContainer from "./FileContainer";

function FileForm(props){
    return(
        <div id={"manage-files"}>
            <div className="modal fade" id="add-file-modal" tabIndex="-1" role="dialog" aria-labelledby="add-file-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-file-modal-label">Choose file</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <FileContainer {...props}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default FileForm;