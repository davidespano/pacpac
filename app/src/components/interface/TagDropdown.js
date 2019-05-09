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
        let selectedId = 'chosen-tag-' + selected.uuid;
        return (
            <div className={'wrapper-dropdown-tags'} id={'wrapper-dropdown-tags-' + component}>
                <div className={'chosen-tag-' + component}
                     onClick={() => display(props, component)}
                >
                    <p id={selectedId} className={'p-tag-form'}>
                        <span style={color(selected.color)}> </span>
                        {selected.name}
                        <i className={'arrow '+ checkSelectionArrow(props, component)}></i>
                    </p>
                </div>
                <ul className={checkSelection(props, component)}>
                    {[...props.tags.values()].map(tag => {
                        let id = (component + tag.uuid).replace('-', "") ;
                        return (
                            <li id={id} key={id}
                                onClick={() => {handleSelection(props, component, tag);}}
                            >
                                <span style={color(tag.color)}> </span>
                                {tag.name}

                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

}

/**
 * Handles tag selection
 * @param props
 * @param component
 * @param tag
 */
function handleSelection(props, component, tag){
    if(component === 'topbar'){
        props.selectTagNewScene(tag.uuid);
        display(props, component);
    } else {
        let newScene = props.scenes.get(props.currentScene).set('tag', tag.uuid);
        props.updateScene(newScene);
    }
}

/**
 * Shows tags (topbar oly, rightbar is managed in AppView)
 * @param props
 * @param component
 */
function display(props, component){
    if(component === 'topbar')
        props.dropdownTagsNewScene(!props.editor.chooseTagNewScene);
}

/**
 * Returns rule for tag color
 * @param color
 */
function color(color){
    return {backgroundColor : color};
}

/**
 * check if dropdown is open
 * @param props
 * @param component
 * @returns {string}
 */
function checkSelection(props, component){
    if(component === 'topbar')
        return props.editor.chooseTagNewScene ? 'show-tags' : 'hide-tags';
    else
        return props.editor.chooseTagRightbar ? 'show-tags' : 'hide-tags';
}

/**
 * check dropdown arrow
 * @param props
 * @param component
 * @returns {string}
 */
function checkSelectionArrow(props, component){
    if(component === 'topbar')
        return props.editor.chooseTagNewScene ? 'arrow-up' : 'arrow-down';
    else
        return props.editor.chooseTagRightbar ? 'arrow-up' : 'arrow-down';
}

export default TagDropdown;