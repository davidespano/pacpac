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
        buttonsValues: {},
    },
    media : {
        media0 : null,
    },
    audio : {
        audio0: null,

    },
    ...defaultValues
});


export default Keypad;