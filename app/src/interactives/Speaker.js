import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Speaker = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SPEAKER,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default Speaker;
