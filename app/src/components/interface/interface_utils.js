import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import scene_utils from "../../scene/scene_utils";
import Values from "../../interactives/rules/Values";
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
        case 'visible':
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
 * dispatch file updating when closing audio, edit media and input scene form
 * @param props
 */
function handleFileUpdate(props){
    switch(props.editor.selectedMediaToEdit){
        case 'mask':
        case 'media0':
        case 'media1':
            let obj = props.interactiveObjects.get(props.currentObject);
            setPropertyFromValue(obj, props.editor.selectedMediaToEdit, props.editor.selectedFile, props);
            break;
        case 'rightbar':
            let scene = props.scenes.get(props.currentScene);
            scene_utils.setProperty(scene, 'img', props.editor.selectedFile, props);
            break;
    }
}

/**
 * reset form fields
 * @id form id
 */
function resetFields(id){
    document.getElementById(id).reset();
}


/**
 * checks and sets audio selection
 * @param props
 * @param audio
 */
function audioSelection(props, audio){
    console.log(audio)
    props.editor.selectedAudioToEdit === audio.uuid ? props.selectAudioToEdit(null) :
        props.selectAudioToEdit(audio.uuid, audio.file, audio.isSpatial, audio.loop);
}


/**
 * returns string according to the given value
 * @param valueUuid
 * @returns {string}
 */
function valueUuidToString(valueUuid){
    switch(valueUuid){
        case Values.VISIBLE:
            return 'visibile';
        case Values.INVISIBLE:
            return 'invisibile';
        case Values.ON:
            return 'acceso';
        case Values.OFF:
            return 'spento';
        case Values.LOCKED:
            return 'chiuso';
        case Values.UNLOCKED:
            return 'aperto';
        case Values.COLLECTED:
            return 'raccolto';
        case Values.NOT_COLLECTED:
            return 'non raccolto';
        case Values.THREE_DIM:
            return '3D';
        case Values.TWO_DIM:
            return '2D';
        default:
            return 'stato sconosciuto';
    }

}



export default {
    onlyNumbers : onlyNumbers,
    setPropertyFromId : setPropertyFromId,
    setPropertyFromValue : setPropertyFromValue,
    title : title,
    centroid: calculateCentroid,
    checkSelection: checkSelection,
    handleFileUpdate: handleFileUpdate,
    resetFields: resetFields,
    valueUuidToString: valueUuidToString,
    audioSelection: audioSelection,
}