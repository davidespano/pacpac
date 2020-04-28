import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Health = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.HEALTH,
    properties : {
        health : 100,
        size: 5,
    },
    ...defaultValues
});

export default Health;

