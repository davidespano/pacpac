import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Door = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.DOOR,
    properties : {
        state: { open: 'CLOSED', lock: 'UNLOCKED' }
    },
    deviceStateMapping:
    {
        open: { channel: ['isOpen', 'open'], type: 'Switch', itemid: "" },
        locked: { channel: ['lock'], type: 'Switch', itemid: "" },
    },
    deviceRecognitionTags: ["door", "lock"],
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Door;
