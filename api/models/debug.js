const _ = require('lodash');
const Debug = require('../models/neo4j/debug');

function createDebugState(session, uuid, name, gameID) {
    console.log(name);
    return session.run(
        'MATCH (scene:Debug:`' + gameID + '` {name: $name}) ' +
        'RETURN scene', {name: name})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                throw {message: "Debug scene already exists", status: 422};
            }
            else {
                return session.run(
                    'MERGE (scene:Debug:`' + gameID + '`{name: $name}) ' +
                    'SET scene={uuid:$uuid, name: $name} ' +
                    'RETURN scene', {uuid: uuid, name: name})
            }
        })
        .then(result => {
            if (result.records[0]) {
                console.log("New Debug Node ok");
            }
            else {
                console.log("Something went wrong");
            }
        });
}

module.exports = {
    createDebugState : createDebugState
}