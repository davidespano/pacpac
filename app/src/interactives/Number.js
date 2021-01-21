import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";
let uuid = require('uuid');


const Number = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.NUMBER,
    properties : {
        id : [],
        name: [],
        value: [],
    },
    ...defaultValues
});

export default Number;