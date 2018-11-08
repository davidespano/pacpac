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
        case "vertices":
            newObject = object.set(property, value);
            break;
        // specific properties
        default:
            let properties = object.get('properties');
            properties[property] = value;
            newObject = object.setIn(['properties'], properties);
    }

    props.updateCurrentObject(newObject);
    props.updateObject(newObject);

    let currentScene = props.scenes.get(props.currentScene);
    InteractiveObjectAPI.saveObject(currentScene, props.currentObject);
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
}