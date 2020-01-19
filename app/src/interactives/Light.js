import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Light = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.LIGHT,
    properties :
    {
        state: { state: 'OFF', color: "RED" }
    },
    deviceStateMapping:
    {
        state: { channel: ['brightness', 'color'], type: 'Switch', itemid: "", deviceChannel: "" },
        color: { channel: ['color'], type: 'Color', itemid: "", deviceChannel: "" },
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Light;
