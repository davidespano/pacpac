import InteractiveObject from "./InteractiveObject";
import InteractiveObjectsTypes from "./InteractiveObjectsTypes";
import Values from "../rules/Values";

/**
 * @param defaultValues for generic and specific properties
 * @returns {Immutable.Map<K, V>}
 * @constructor
 */

/* [Vittoria] una transizione non è altro che un oggetto interattivo (il quale è un oggetto Immutabile) e sovrascrivo
alcune delle proprietà di default, per creare una nuova transizione uso questa sintassi:
 let t = Transition({
         qua ci vanno i valori che mi interessa modificare (gli altri saranno a default), in genere si dà nome e uuuid
});*/

const Transition = defaultValues => InteractiveObject({
    type : InteractiveObjectsTypes.TRANSITION,
    properties : {
        duration : 500,
        direction: Values.NO_DIR,
    },
    media : {
        media0: null,
    },
    audio : {
        audio0: null,
    },
    ...defaultValues
});

export default Transition;