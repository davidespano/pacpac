import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Switch = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SWITCH,
    properties : {
        state : 'OFF',
    },
    media : {
        media0 : null,
        media1 : null,
    },
    ...defaultValues
});

export default Switch;