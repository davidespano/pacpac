import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Rule = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.RULES,
    properties : {

    },
    ...defaultValues
});

export default Rule;