import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const DLock = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.DLOCK,
    properties : {
        state: false
    },
    ...defaultValues
});

export default DLock;
