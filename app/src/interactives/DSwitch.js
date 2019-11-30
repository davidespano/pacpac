import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const DSwitch = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.DSWITCH,
    properties : {
        state: false
    },
    ...defaultValues
});

export default DSwitch;
