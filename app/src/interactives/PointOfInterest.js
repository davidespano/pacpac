import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const PointOfInterest = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.POINT_OF_INTEREST,
    properties : {
        delay: 0,
    },
    media : null,
    audio : null,
    ...defaultValues
});

export default PointOfInterest;