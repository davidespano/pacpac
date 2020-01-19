import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const SmokeDetector = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.SMOKE_DETECTOR,
    properties : {
        state: { smoke: 'OFF'}
    },
    deviceStateMapping:
    {
        smoke: { channel: ['smoke', 'state', 'detect', 'alarm'], type: 'Switch', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default SmokeDetector;
