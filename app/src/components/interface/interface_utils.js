import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import Transition from "../../interactives/Transition";

/**
 * Updates object property with the given value, returns new object
 * @param object
 * @param property
 * @param value
 * @param props
 */
function setPropertyFromValue(object, property, value, props){
    let newObject;

    switch (property) {
        // generic properties belonging to any interactive object
        case "name":
        case "media":
        case "mask":
        case "vertices":
            newObject = object.set(property, value);
            break;
        // specific properties
        default:
            let properties = object.get('properties');
            properties[property] = value;
            newObject = object.setIn(['properties'], properties);
    }

    props.updateCurrentObject(newObject.uuid);
    props.updateObject(newObject);

    let currentScene = props.scenes.get(props.currentScene);

    InteractiveObjectAPI.saveObject(currentScene, newObject);

    if(property === "vertices"){
        //props.editVertices(newObject);
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
 * @returns array containing x and y values of the 2d centroid
 */
function calculateApproximativeCentroid(vertices, radius = 10) {

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

    //calculate latitude and longitude to obtain approximate 2d centroid

    let lat = Math.acos(centroid[1] / radius);
    let lon = Math.atan(centroid[0] / centroid[2]);

    return [lat, lon];
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
 * @param child
 * @returns {string}
 */
function title(scene) {
    return (
        "Scena: " + scene.name +
        "\nEtichetta: " + scene.tag.tagName
    );
}

export default {
    onlyNumbers : onlyNumbers,
    setPropertyFromId : setPropertyFromId,
    setPropertyFromValue : setPropertyFromValue,
    title : title,
    centroid: calculateApproximativeCentroid,
}