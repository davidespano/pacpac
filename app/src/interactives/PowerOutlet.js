import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const PowerOutlet = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.POWER_OUTLET,
    properties : {
        state: { state: 'OFF' }
    },
    deviceStateMapping:
    {
        state: { channel: ['power', 'ison', 'setpower', 'ch1'], type: 'Switch', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default PowerOutlet;
