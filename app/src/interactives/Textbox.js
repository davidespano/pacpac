import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

const Textbox = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TEXTBOX,
    properties : {//valori di riferimento, quelli di default si cambiano in topbar.js
            string: "testo",
            alignment: Values.TEXTLEFT,
            fontSize: 5,
            boxSize: 5,
    },
    ...defaultValues
});

export default Textbox;

//TODO, regole, interfaccia (rightbar, objectoptions), database
//devo capire come vengono instanziati gli oggetti a runtime
// (anche per il problema della chiave da rimettere a posto)
//dove sono le chiamate di inserimento nel db?