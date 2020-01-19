import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const AirConditioner = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.AIR_CONDITIONER,
    properties : {
        state: { state: 'OFF', temperature: 23 }
    },
    deviceStateMapping:
    {
        state: { channel: ['power', 'isOn', 'state'], type: 'Switch', itemid: "", deviceChannel: "" },
        temperature: { channel: ['temperature', 'settemp'], type: 'Number', itemid: "", deviceChannel: "" },
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default AirConditioner;
