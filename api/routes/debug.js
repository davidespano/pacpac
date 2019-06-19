const Debug = require('../models/debug')
    , _ = require('lodash')
    , writeResponse = require('../helpers/response').writeResponse
    , dbUtils = require('../neo4j/dbUtils');


function createDebugState(req, res, next) {
    const uuid = req.body.uuid;
    const name = req.body.name;
    const gameID = req.params.gameID;

    Debug.createDebugState(dbUtils.getSession(req), uuid, name, gameID)
        .then(response => writeResponse(res, response))
        .catch(next);
}

module.exports = {
    createDebugState: createDebugState
}