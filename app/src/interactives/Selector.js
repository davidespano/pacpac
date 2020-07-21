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
        optionsNumber: 3,
        state : 1,
    },
    media : {
        media0 : null,
        media1 : null,
        media2 : null,
        media3 : null,
        media4 : null,
        media5 : null,
        media6 : null,
        media7 : null,
        media8 : null,
        media9 : null,
    },
    audio : {
        audio0: null,
    },
    ...defaultValues
});

export default Selector;