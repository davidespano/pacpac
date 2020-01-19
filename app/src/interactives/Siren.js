import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Siren = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.SIREN,
    properties : {
        state: { state: 'OFF', volume: '100'}
    },
    deviceStateMapping:
    {
        state: { channel: ['power', 'ison', 'setpower'], type: 'Switch', itemid: "", deviceChannel: "" },
        volume: { channel: ['volume', 'setvolume'], type: 'Number', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Siren;
