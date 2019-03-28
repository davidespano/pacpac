import Immutable from "immutable";

/**
 * @type {*|Immutable.Record.Class}
 * @param uuid default null
 * @param type default 'file
 * @param name default null
 */
const Asset = Immutable.Record({

    uuid : null,
    type: 'file',
    name : null,

});

export default Asset;