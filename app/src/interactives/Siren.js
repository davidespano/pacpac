import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const Siren = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SIREN,
    properties : {
        state: {}
    },
    ...defaultValues
});

export default Siren;
