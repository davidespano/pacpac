import Immutable from "immutable";

/**
 * @type {*|Immutable.Record.Class}
 * @param username default empty string
 * @param games default empty array
 */
const User = Immutable.Record({

    uuid: null,
    username : "",
    games : [], // uuid list

});

export default User;