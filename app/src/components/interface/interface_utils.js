import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";

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
 * Given an EditorState, returns currently selected entity. Offset "moves" the cursor of n spaces to the left before
 * checking.
 * @param state (EditorState)
 * @param offset (move selection n spaces to the left)
 * @returns entity if any, null otherwise
 */
function getEntity(state, offset = 0) {

    const blockStart = state.getCurrentContent().getBlockForKey(state.getSelection().getAnchorKey());
    const blockEnd = state.getCurrentContent().getBlockForKey(state.getSelection().getFocusKey());

    //checks if selection spans over multiple blocks
    if(blockStart !== blockEnd){
        console.log('multiple blocks!')
        return null;
    }

    const entityStart = blockStart.getEntityAt(state.getSelection().getStartOffset() - offset);
    const entityEnd = blockEnd.getEntityAt(state.getSelection().getEndOffset() - offset);

    //checks if entity is null or selection covers more than one entity
    if(!entityStart || (entityStart !== entityEnd)){
        return null;
    }

    return state.getCurrentContent().getEntity(entityStart);
}


export default {
    onlyNumbers : onlyNumbers,
    setPropertyFromId : setPropertyFromId,
    setPropertyFromValue : setPropertyFromValue,
    title : title,
    centroid: calculateCentroid,
    checkSelection: checkSelection,
    getEntity: getEntity,
}