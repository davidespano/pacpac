import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const PowerOutlet = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.POWER_OUTLET,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default PowerOutlet;
