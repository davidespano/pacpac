import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Sensor = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SENSOR,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default Sensor;
