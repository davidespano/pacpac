import IoTInteractiveObject from "./IoTInteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Blind = defaultValues => IoTInteractiveObject({
    type : InteractiveObjectsTypes.BLIND,
    properties : {
        state: { roller: 0 }
    },
    deviceStateMapping:
    {
        roller: { channel: ['curtainControl', 'blindControl', 'control'], type: 'Rollershutter', itemid: "" },
    },
    media: {
        media0: null,
    },
    audio: {
        audio0: null,
    },
    ...defaultValues
});

export default Blind;
