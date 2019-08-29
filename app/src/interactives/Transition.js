import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Transition = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TRANSITION,
    properties : {
        duration : 2000,
        direction: Values.NO_DIR,
    },
    media : {
        media0: null,
    },
    audio : {
        audio0: null,
    },
    ...defaultValues
});

export default Transition;