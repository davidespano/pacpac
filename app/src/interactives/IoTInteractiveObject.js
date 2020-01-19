import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
export default defaultValues => InteractiveObject({
    deviceUuid: "",
    deviceStateMapping: {},
    deviceRecognitionTags: [],
    ...defaultValues
});
