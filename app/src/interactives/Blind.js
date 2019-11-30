import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Blind = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.BLIND,
    properties : {
        state: 0.0
    },
    ...defaultValues
});

export default Blind;
