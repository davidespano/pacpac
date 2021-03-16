import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 * Keypad must have at least three buttons (two digit/chars and a confirmation button)
 */
const Button = (defaultValues) => InteractiveObject({
    type : InteractiveObjectsTypes.BUTTON,
    properties : {
        keypadUuid: null,
        state: 'OFF',
    },
    media : {
        media0 : null,

    },
    audio : {
        audio0: null,

    },
    ...defaultValues
});


export default Button;