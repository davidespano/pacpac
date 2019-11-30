import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Door = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.DOOR,
    properties : {
        state: false
    },
    ...defaultValues
});

export default Door;
