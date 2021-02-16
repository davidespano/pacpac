import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import InteractiveObject from "./InteractiveObject";

const Lock = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.LOCK,
    properties : {
        key_uuid : null,
    },
    media : {
        media0: null,
    },
    audio : {
        audio0: null,
    },
    ...defaultValues
});

export default Lock;