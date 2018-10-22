import Immutable from "immutable"

/**
 * @type {*|Immutable.Record.Class}
 * @param uuid default null
 * @param name default null
 * @param type default null
 * @param media default empty string
 * @param vertices default empty string
 * @param properties default null, will contain specific properties of the object such as the state
 */
const InteractiveObject = Immutable.Record({

    uuid : null,
    name : null,
    type : null,
    media : "",
    vertices : "",
    properties : null,

});

export default InteractiveObject;