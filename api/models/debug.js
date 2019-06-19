const _ = require('lodash');
const DebugState = require('../models/neo4j/debugState');

function createUpdateDebugState(session, debugState, gameID) {
    let state = new DebugState(debugState);
    let objectStates = state.objectStates;

    delete state.objectStates;

    return session.run(
        'MERGE (state:Debug:DebugState:`' + gameID + '`) ' +
        'SET state += $state ' +
        'WITH state ' +
        'UNWIND $objectStates as object ' +
        'MERGE (o:Debug:DebugObject {uuid: object.uuid}) ' +
        'SET o += object ' +
        'MERGE (state)-[:STORES_OBJECT]->(o) ' +
        'RETURN state', {state: state, objectStates: objectStates})
        .then(() => debugState);
}

function getDebugState(session, gameID){
    return session.run(
        'MATCH (state:Debug:DebugState:`' + gameID + '`)-[:STORES_OBJECT]->(object:DebugObject) ' +
        'RETURN state, collect(object) AS objects'
    ).then(result => {
        const record = result.records[0];
        const currentScene = record.get('state').properties.currentScene;
        const objectsStates = record.get('objects').map(obj => obj.properties);

        const debugState = new DebugState({
            currentScene: currentScene,
            objectStates: objectsStates,
        })

        if(debugState)
            return debugState;
        else
            throw {message: 'state not found', status: 404};
    })
}

module.exports = {
    createUpdateDebugState : createUpdateDebugState,
    getDebugState: getDebugState,
}