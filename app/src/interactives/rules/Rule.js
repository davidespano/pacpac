import Immutable from "immutable";
import Action from "./Action";


/**
 * @type {*|Immutable.Record.Class}
 * @param uuid default null
 * @param object_uuid default null, will contain the uuid of the obj the rule is associated to
 * @param event default null
 * @param condition default empty object
 * @param actions default empty array
 */
const Rule = Immutable.Record({

    uuid : null,
    event : null,
    condition : {},
    actions : [],

});

export default Rule;