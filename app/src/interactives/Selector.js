import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Selector = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SELECTOR,
    properties : {
        optionsNumber: 0,
        state : [],
    },
    media : {
        media0 : null,
        media1 : null,
    },
    audio : {
        audio0: null,
        audio1: null,
    },
    ...defaultValues
});

export default Selector;