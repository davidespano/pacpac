import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const MotionDetector = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.MOTION_DETECTOR,
    properties : {
        state: false
    },
    ...defaultValues
});

export default MotionDetector;
