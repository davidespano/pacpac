import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Transition = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TRANSITION,
    properties : {
        duration : 2000,
    },
    ...defaultValues
});

export default Transition;