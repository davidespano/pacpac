import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Sensor = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.SENSOR,
    properties : {
        state: { state: 'OFF', value: 0 }
    },
    deviceStateMapping:
    {
        state: { channel: [], type: 'Switch', itemid: "", deviceChannel: "" },
        value: { channel: [], type: 'Number', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Sensor;
