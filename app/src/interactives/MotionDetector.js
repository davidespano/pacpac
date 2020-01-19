import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const MotionDetector = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.MOTION_DETECTOR,
    properties : {
        state: { motion: 'OFF' }
    },
    deviceStateMapping:
    {
        motion: { channel: ['motion', 'status', 'detect'], type: 'Switch', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default MotionDetector;
