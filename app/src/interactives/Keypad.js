import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 * Keypad must have at least three buttons (two digit/chars and a confirmation button)
 */
const Keypad = (defaultValues) => InteractiveObject({
    type : InteractiveObjectsTypes.KEYPAD,
    properties : {
        state: null,
        combination : null, //must be an array
        inputSize: 3,
    },
    media : {
        media0 : null,
        media1: null,
        media2: null,
    },
    audio : {
        audio0: null,
        audio1: null,
        audio2: null,
    },
    ...defaultValues
});


export default Keypad;