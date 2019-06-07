import React from 'react';
import SceneAPI from "../../utils/SceneAPI";
import Tag from "../../scene/Tag";
let uuid = require('uuid');

function TagMenu(props){
    return(
        <div id={"manage-tags"}>
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
                            <input type={'text'} id={'tag-search'}
                                   className={'tag-inputs'}
                                   placeholder={"Filtra..."}
                                   onChange={() => {
                                       let value = document.getElementById('tag-search').value;
                                       props.updateTagFilter(value);
                                   }}
                            />
                            <div id={'tag-box'}>
                                {generateDefaultTag()}
                                {generateTags(props)}
                            </div>
                            <div id={'add-tag'}>
                                <input type={'color'} id={'tag-add-color'} defaultValue={'#000000'}/>
                                <input type={'text'} id={'tag-add-text'} className={'tag-inputs'} placeholder={'Aggiungi un\'etichetta...'}/>
                                <button
                                    title={"Add new tag"}
                                    id={'tag-add-button'}
                                    type={'button'}
                                    className={"tag-form-button"}
                                    onClick={() => createTag(props)}
                                >
                                    <img className={"action-buttons"} src={"icons/icons8-plus-white-30.png"}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function generateDefaultTag(){
    return(
        <div className={'tag-element'} key={'tag-default-element'} id={'tag-default-element'}>
            <input className={'tag-element-color'} type={'color'} value={'#000000'} disabled/>
            <input className={'tag-element-text'} id={'default-tag-text'} type={'text'} value={'default'} disabled/>
        </div>
    );
}

function generateTags(props){
    return [...props.tags.values()].map(tag => {
        if(tag.name !== 'default' && tag.name.includes(props.editor.tagFilter)){
            return (
                <div className={'tag-element'} key={'tag-' + tag.uuid + '-element'}>
                    <input className={'tag-element-color'}
                           type={'color'}
                           id={tag.uuid + '-color'}
                           defaultValue={tag.color}
                           onChange={() => editTag(tag.uuid, props)}
                    />
                    <input className={'tag-element-text'}
                           type={'text'}
                           id={tag.uuid + '-text'}
                           defaultValue={tag.name}
                           onChange={() => editTag(tag.uuid, props)}
                    />
                    <button
                        title={"Remove " + tag.name}
                        id={'tag-' + tag.uuid + '-remove-button'}
                        className={"action-buttons-container"}
                        onClick={() => {
                            SceneAPI.removeTag(tag.uuid);
                        }}
                    >
                        <img className={"action-buttons"} src={"icons/icons8-waste-50.png"}/>
                    </button>
                </div>
            );
        }
    });
}


function createTag(props){
    let name = document.getElementById('tag-add-text').value;
    let color = document.getElementById('tag-add-color').value;

    if(name !== ''){
        let tag = Tag({
            uuid: uuid.v4(),
            name: name,
            color: color,
        });

        props.addNewTag(tag);
    }
}


function editTag(uuid, props){
    let name = document.getElementById(uuid + '-text').value;
    let color = document.getElementById(uuid + '-color').value;

    let newTag = Tag({
        uuid: uuid,
        name: name,
        color: color,
    });

    props.updateTag(newTag);
}

export default TagMenu;