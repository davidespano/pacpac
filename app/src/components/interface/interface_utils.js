import InteractiveObjectAPI from "../../utils/InteractiveObjectAPI";
import Transition from "../../interactives/Transition";

/**
 * Updates object property with the new value given by user
 * @param object to update
 * @param property to update
 * @param id of the html field containing the new value
 * @param props
 */
function setProperty(object, property, id, props){
    let value = document.getElementById(id).textContent;

    switch (property) {
        // generic properties belonging to any interactive object
        case "name":
        case "media":
        case "vertices":
            object.set(property, value);
            break;
        // specific properties
        default:
            let properties = object.get('properties');
            properties[property] = value;
            object.setIn(['properties'], properties);
    }
    props.updateCurrentObject(object);
    InteractiveObjectAPI.saveTransitions(props.currentScene, props.currentObject);

    console.log(object);
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
    setProperty : setProperty,
    title : title,
}