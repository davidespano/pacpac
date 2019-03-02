import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import {EditorState, Modifier, SelectionState} from 'draft-js';
/**
 * Updates object property with the given value, returns new object
 * @param object
 * @param property
 * @param value
 * @param props
 */
function setPropertyFromValue(object, property, value, props){
    let newObject, subProperty;
    let media = object.get('media');

    if(property.includes('media')){
        subProperty = property;
        property = 'media';
    }

    switch (property) {
        // generic properties belonging to any interactive object
        case "name":
        case "mask":
        case "vertices":
            newObject = object.set(property, value);
            break;
        // specific properties
        case "media":
            media[subProperty] = value;
            newObject = object.setIn(['media'], media);
            break;
        default:
            let properties = object.get('properties');
            properties[property] = value;
            newObject = object.setIn(['properties'], properties);
    }

    props.updateCurrentObject(newObject.uuid);
    props.updateObject(newObject);

    let scene = props.scenes.get(props.objectToScene.get(newObject.uuid));

    InteractiveObjectAPI.saveObject(scene, newObject);

    if(property === "vertices"){
        props.editVertices(newObject);
    }
}

/**
 * Updates object property retrieving new value from the given field
 * @param object to update
 * @param property to update
 * @param id of the html field containing the new value
 * @param props
 */
function setPropertyFromId(object, property, id, props){
    let value = document.getElementById(id).textContent;
    setPropertyFromValue(object, property, value, props);
}

/**
 * Generates approximative 2d centroid for the interaction area starting from the given vertices.
 * @param vertices is a string that contains all of the vertices values
 * @param radius of the sphere
 * @returns [longitude, latitude]
 * This function returns latitude and longitude because they are fixed values that can be easily stored in
 * CentroidsStore. x and y must be calculated later, since the size of central image is variable.
 */
function calculateCentroid(vertices, radius = 9.5) {

    vertices = vertices.split(',').join(" "); //replace commas with whitespaces
    let coordinates = vertices.split(" ").map(x => parseFloat(x));
    let medianPoint = [0.0, 0.0, 0.0];

    for (let i = 0; i < coordinates.length; i += 3) {
        medianPoint[0] += coordinates[i];
        medianPoint[1] += coordinates[i + 1];
        medianPoint[2] += coordinates[i + 2];
    }

    medianPoint = medianPoint.map(x => {
        return x / (coordinates.length / 3)
    });

    //project median onto sphere to obtain approximate 3d centroid
    /*https://stackoverflow.com/questions/9604132/how-to-project-a-point-on-to-a-sphere*/

    let length = Math.sqrt(Math.pow(medianPoint[0], 2) + Math.pow(medianPoint[1], 2) + Math.pow(medianPoint[2], 2));

    let centroid = medianPoint.map(x => {
        return radius / length * x
    });

    // calculate latitude and longitude to obtain approximate 2d centroid

    let lat = 90 - (Math.acos(centroid[1] / radius)) * 180 / Math.PI;
    let lon = ((270 + (Math.atan2(centroid[0] , centroid[2])) * 180 / Math.PI) % 360) -180;


    // adjust latitude and longitude to obtain values in percentage

    const x = (180 - lon) * 100 / 360;
    const y = (180 - lat) * 100 / 360;


    return [x, y];
}

/**
 * Allows only numbers in input
 * @param id of input field
 */
//https://stackoverflow.com/questions/8808590/html5-number-input-type-that-takes-only-integers/17208628
function onlyNumbers(id) {
    let text = document.getElementById(id);
    text.textContent = text.textContent.replace(/[^0-9.]/g, '');
    text.textContent = text.textContent.replace(/(\..*)\./g, '$1');
}

/**
 * Generates title for a scene
 * @param name
 * @param tagName
 * @returns {string}
 */
function title(name, tagName) {
    return (
        "Scena: " + name +
        "\nEtichetta: " + tagName
    );
}

/**
 * Check if the given option element is selected according to the editor state
 * @param element (such as rightbar)
 * @param option value
 * @param editor is the object containing all the editor variables representing its state
 */
function checkSelection(element, option, editor){
    switch(element){
        case 'rightbar':
            return ((editor.rightbarSelection === option) ? '' : 'inactive');
        default:
            return 'inactive';
    }
}

/**
 * Returns true if multiple chars are selected
 * @param state
 * @returns {boolean}
 */
function checkIfMultipleSelection(state){
    const selectionLength = state.getSelection().getEndOffset() - state.getSelection().getStartOffset();
    return selectionLength > 0;
}


/**
 * Returns currently selected entity (doesn't check if selection spans over multiple blocks or entities)
 * @param state
 * @param offset
 * returns entity
 */
function getEntity(state, offset = 0){
    const selection = state.getSelection();
    const block = state.getCurrentContent().getBlockForKey(selection.getAnchorKey());
    const entity = block.getEntityAt(selection.getStartOffset() + offset);

    return entity !== null ? state.getCurrentContent().getEntity(entity) : null;
}

/**
 * check selected entity
 * @param state
 * @param offset (move selection n spaces)
 * @returns {boolean}
 */
function checkIfEditableCursor(state, offset){
    let entity = getEntity(state, offset);

    console.log('ENTITY: ' + entity);

    return entity !== null && entity.getType() !== 'quando' && entity.getType() !== 'se' && entity.getType() !== 'allora';
}

/**
 * check selected entity
 * @param state
 * return {boolean}
 */
function checkIfDeletableCursor(state){
    return checkIfEditableCursor(state) && (getEntity(state) === getEntity(state, -1));
}

/**
 * @param state
 * return {boolean}
 */
function checkIfPlaceholderNeeded(state){
    const entity = getEntity(state);
    return ((getEntity(state, -2) !== entity) && (getEntity(state, 1) !== entity));
}

/**
 * Given an EditorState, returns true only selection spans over a single block
 * @param state
 * @returns {boolean}
 */
function checkBlock(state){
    const blockStart = state.getCurrentContent().getBlockForKey(state.getSelection().getAnchorKey());
    const blockEnd = state.getCurrentContent().getBlockForKey(state.getSelection().getFocusKey());

    //checks if selection spans over multiple blocks
    return (blockStart === blockEnd);
}

/**
 * Given an EditorState, returns true only if the selection spans over a single entity.
 * Doesn't check if selection spans over multiple blocks
 * Offset "moves" the cursor of n spaces
 * @param state (EditorState)
 * @returns {boolean}
 */
function checkEntity(state) {

    const block = state.getCurrentContent().getBlockForKey(state.getSelection().getAnchorKey());
    const entityStart = block.getEntityAt(state.getSelection().getStartOffset());
    const entityEnd = block.getEntityAt(state.getSelection().getEndOffset());

    //checks if entity is null or selection covers more than one entity
    return (entityStart !== null && (entityStart === entityEnd));
}

/**
 * check previous entity
 * @param state
 */
function firstCheck(state){
    return getEntity(state, -1) === getEntity(state, 0);
}

/**
 * check previous entity
 * @param state
 */
function secondCheck(state){
    const selectionLength = state.getSelection().getEndOffset() - state.getSelection().getStartOffset();
    return getEntity(state, selectionLength+1) === getEntity(state, 0);
}

function isMention(state) {
    let entity = getEntity(state);

    console.log('ENTITY: ' + entity);

    return entity !== null && entity.getType() === 'mention';
}

/**
 * check if a text selected contains a space at the end
 */
function checkEndSpace() {
    const textSelected = window.getSelection().toString();
    return  textSelected.slice(-1) === " ";
}

export default {
    onlyNumbers : onlyNumbers,
    setPropertyFromId : setPropertyFromId,
    setPropertyFromValue : setPropertyFromValue,
    title : title,
    centroid: calculateCentroid,
    checkSelection: checkSelection,
    getEntity: getEntity,
    checkIfEditableCursor: checkIfEditableCursor,
    checkIfMultipleSelection: checkIfMultipleSelection,
    checkIfDeletableCursor: checkIfDeletableCursor,
    checkIfPlaceholderNeeded: checkIfPlaceholderNeeded,
    checkBlock: checkBlock,
    checkEntity: checkEntity,
    firstCheck: firstCheck,
    secondCheck: secondCheck,
    checkEndSpace: checkEndSpace,
    isMention: isMention,
}