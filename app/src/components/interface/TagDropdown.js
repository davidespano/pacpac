import React from 'react';

function TagDropdown(properties){

    let props = properties.props;
    let component = properties.component;
    let selected;

    if(component === 'topbar'){
        selected = props.tags.get(props.editor.selectedTagNewScene);
    } else {
        selected = props.tags.get(props.scenes.get(props.currentScene).tag);
    }

    if(selected){
        return (
            <div className={"choose-tag-dropdown-" + component}>
                <div className={"dropdown-tags-element-chosen-" + component}>
                    <input type={'color'} defaultValue={selected.color} disabled/>
                    <p className={'tag-text'}>{selected.name}</p>
                </div>
                <button
                    title={"See tags..."}
                    className={"action-buttons-container dropdown-tags-btn-" + component}
                    onClick={() => display(props, component)}
                >
                    <img className={"action-buttons dropdown-tags-btn-" + component} src={"icons/icons8-expand-arrow-filled-50.png"}/>
                </button>
                {handleTagsButton(component)}
                <div className={"dropdown-tags-" + component + " " + checkSelection(props, component)}>
                    {[...props.tags.values()].map( tag => {
                        return (
                            <div className={'dropdown-tags-element-' + component}
                                 key={tag.uuid}
                                 onClick={() => {
                                     handleSelection(props, component, tag);
                                 }}
                            >
                                <input type={'color'} defaultValue={tag.color} disabled/>
                                <p className={'tag-text'}>{tag.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

}

function display(props, component){
    if(component === 'topbar')
        props.dropdownTagsNewScene(!props.editor.chooseTagNewScene);
}

function checkSelection(props, component){
    if(component === 'topbar')
        return props.editor.chooseTagNewScene ? 'show-tags' : '';
    else
        return props.editor.chooseTagRightbar ? 'show-tags' : '';
}

function handleTagsButton(component){
    if(component === 'topbar'){
        return(
            <button
                title={"Tag manager"}
                className={"tag-manager-btn action-buttons-container dropdown-tags-btn-" + component}
                data-toggle="modal"
                data-target="#add-tag-modal"
            >
                <img className={"action-buttons dropdown-tags-btn-" + component} src={"icons/icons8-tags-white-50.png"}/>
            </button>
        );
    }
}

function handleSelection(props, component, tag){
    if(component === 'topbar'){
        props.selectTagNewScene(tag.uuid);
        display(props, component);
    } else {
        let newScene = props.scenes.get(props.currentScene).set('tag', tag.uuid);
        props.updateScene(newScene);
        console.log(newScene);
    }
}

export default TagDropdown;