import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

//TODO Timer scegliere proprietà
const Timer = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TIMER,
    properties : {
        time : 1000,
    },
    ...defaultValues
});

export default Timer;

