import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Light = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.LIGHT,
    properties : {
        state: false
    },
    ...defaultValues
});

export default Light;
