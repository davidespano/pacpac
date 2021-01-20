import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Flag = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.FLAG,
    properties : {
        id : [],
        name: [],
        value: [],
    },
    ...defaultValues
});

export default Flag;