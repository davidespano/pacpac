import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";

const Key = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.KEY,
    media : {
        media0: null,
    },
    ...defaultValues
});

export default Key;