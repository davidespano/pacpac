import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import InteractiveObject from "./InteractiveObject";

const Lock = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.LOCK,
    properties : {
        //duration : 2000, //TODO stabilire come impleteare la durata se è una transizione
        key_uuid : null,
    },
    media : {
        media0: null,
    },
    ...defaultValues
});

export default Lock;