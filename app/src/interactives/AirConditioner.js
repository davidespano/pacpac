import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const AirConditioner = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.AIR_CONDITIONER,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default AirConditioner;
