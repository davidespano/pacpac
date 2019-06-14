import React from 'react';
import FileSelectionBtn from "./FileSelectionBtn";
import FormImage from '../../data/FormImage';
import StoryAPI from "../../utils/StoryAPI";

function InputStoryForm(props) {

    return (
        <div id={"addStoryDiv"}>
            <div className="modal fade" id="add-story-modal" tabIndex="-1" role="dialog"
                 aria-labelledby="add-story-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-story-modal-label">Nuova Storia</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
                            <div className={'box-titles'}>Casualit&agrave;</div>
                            <div className={'slider-form'}>
                                <span>1</span><input type="range" min="1" max="10" defaultValue="5" step="1"
                                                     className={"slider"} name="randomness"
                                                     id="randomness"/><span>10</span>
                            </div>

                            {[...props.formImages.values()].map((image, id) => {

                                let properties = {
                                    props: props,
                                    component: 'story-form-' + image.index,
                                };

                                return (
                                    <div key={image.index}>
                                        <br/>
                                        <div className={'box-titles story-form-name'}>Immagine {id + 1}
                                            <button hidden={image.index === 0 ? 'hidden' : ''} className={"action-buttons-container"}
                                                    onClick={() => props.removeFormImage(image.index)}>
                                                <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}
                                                     alt={'Cancella'}/>
                                            </button>
                                        </div>
                                        <div className={'box-grid scene-grid'}>
                                            <p id={'file-selected-name'}
                                               className={'input-new-story ellipsis'}
                                            >
                                                {image.name === '' ? 'Nessuna immagine selezionata' : image.name}
                                            </p>
                                            <FileSelectionBtn {...properties} />
                                        </div>
                                        <div className={'slider-form'}>
                                            Rilevanza<span>1</span>
                                            <input type="range" min="1" max="10" value={image.relevance}
                                                   step="1" className={"relevance slider"}
                                                   name={'relevance-' + image.index} id={'relevance-' + image.index}
                                                   onChange={() => {
                                                       let value = document.getElementById('relevance-' + image.index).value;
                                                       changeRelevance(image, value, props)
                                                   }}
                                            />
                                            <span>10</span>
                                        </div>
                                    </div>
                                );
                            })
                            }
                            <br/>
                            <button className={"btn"} onClick={() => addFormImage(props)}
                                    disabled={checkIfAddButtonDisabled(props)}>+ Immagine
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" data-dismiss="modal"
                                    onClick={() => {
                                        processForm(props)
                                    }}
                                    disabled={checkIfConfirmButtonDisabled(props)}>Crea Storia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function processForm(props) {
    let randomness = document.getElementById('randomness').value, name = [], relevance = [],
        collectionName = Math.floor(Date.now()).toString()
    props.formImages.map((image) => {
        name.push(image.name);
        relevance.push(image.relevance);
    });
    StoryAPI.generateSystemStory(collectionName, name, relevance, randomness);
}


function checkIfAddButtonDisabled(props) {
    return !(props.formImages.count() < 5 && props.formImages.last().name);
}

function checkIfConfirmButtonDisabled(props) {
    return !(props.formImages.last().name);
}

function changeRelevance(image, value, props) {

    let newImage = FormImage({
        index: image.index,
        name: image.name,
        relevance: value,
    });

    props.updateFormImage(newImage);
}

function addFormImage(props) {

    let index = props.formImages.last().index + 1;
    let image = FormImage({
        index: index,
        name: '',
        relevance: 6,
    });

    props.addFormImage(image);

}

export default InputStoryForm;