import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "./rules/Values";

const Key = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.KEY,
    properties : {
        state : Values.NOT_COLLECTED,
    },
    media : {
        media0: null,
    },
    ...defaultValues
});

export default Key;