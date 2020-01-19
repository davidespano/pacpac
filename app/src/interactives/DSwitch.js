import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const DSwitch = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.DSWITCH,
    properties : {
        state: { state: 'OFF'}
    },
    deviceStateMapping:
    {
        state: { channel: ['state', 'ison', 'power', 'switch', 'ch_1', 'ch1'], type: 'Switch', itemid: "", deviceChannel: "" }
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default DSwitch;
