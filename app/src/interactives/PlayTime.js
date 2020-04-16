import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const PlayTime = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.PLAYTIME,
    properties : {
        time : 0, //TODO: bisognerà convertire i secondi in ore:minuti:secondi
        size: 5,
    },
    ...defaultValues
});

export default PlayTime;

