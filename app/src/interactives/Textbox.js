import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Textbox = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TEXTBOX,
    properties : {
            string: "",
            alignment: Values.TEXTLEFT,
            font: null,
            size: null
    },
    ...defaultValues
});

export default Textbox;

//TODO, regole, interfaccia (rightbar, objectoptions), database
//devo capire come vengono instanziati gli oggetti a runtime
// (anche per il problema della chiave da rimettere a posto)
//dove sono le chiamate di inserimento nel db?