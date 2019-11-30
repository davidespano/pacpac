import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const SmokeDetector = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SMOKE_DETECTOR,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default SmokeDetector;
