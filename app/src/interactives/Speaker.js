import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Speaker = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.SPEAKER,
    properties : {
        state: { volume: 50, state: 'OFF' }
    },
    deviceStateMapping:
    {
        volume: { channel: ['volume', 'setvolume', 'changevolume'], type: 'Number', itemid: "", deviceChannel: "" },
        state: { channel: ['state', 'power', 'ison'], type: 'Switch', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Speaker;
