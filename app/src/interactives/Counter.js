import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Counter = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.COUNTER,
    properties : {
        value: 0,
        step: 1,
    },
    media: null,
    audio: null,
    ...defaultValues
});

export default Counter;