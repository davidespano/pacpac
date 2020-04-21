import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Timer = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TIMER,
    properties : {
        time : 1000,
        size: 5,
        autoStart: true,
    },
    ...defaultValues
});


export default Timer;

