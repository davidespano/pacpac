import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Score = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.SCORE,
    properties : {
        score : 0,
        size: 5,
    },
    ...defaultValues
});

export default Score;

