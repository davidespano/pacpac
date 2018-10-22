import Immutable from "immutable";

/**
 * @type {*|Immutable.Record.Class}
 * @param uuid default null
 * @param object_uuid default null, will contain the uuid of the obj the rule is associated to
 * @param event defaul null
 * @param condition default empty object
 * @param actions default empty array
 */
const Rule = Immutable.Record({

    uuid : null,
    object_uuid: null,
    event : null,
    condition : {},
    actions : [],

});

export default Rule;