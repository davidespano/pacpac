import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "./rules/Values";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */
const PointOfInterest = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.POINT_OF_INTEREST,
    properties : {},
    media : {
        media0: null,
    },
    audio : {
        audio0: null,
    },
    ...defaultValues
});

export default PointOfInterest;