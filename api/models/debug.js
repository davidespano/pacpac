const _ = require('lodash');
const DebugState = require('../models/neo4j/debugState');

function createUpdateDebugState(session, debugState, gameID) {
    let state = new DebugState(debugState);
    let objectStates = state.objectStates;
    let saveName = state.saveName;

    delete state.saveName;
    delete state.objectStates;

    return session.run(
        'MERGE (state:Debug:DebugState:`' + gameID + '` {saveName: $saveName}) ' +
        'SET state += $state ' +
        'WITH state ' +
        'UNWIND $objectStates as object ' +
        'MERGE (o:Debug:DebugObject {uuid: object.uuid, saveName: $saveName}) ' +
        'SET o += object ' +
        'MERGE (state)-[:STORES_OBJECT]->(o) ' +
        'RETURN state', {saveName: saveName, state: state, objectStates: objectStates})
        .then(() => debugState);
}

function getDebugState(session, gameID, saveName) {
    console.log(saveName);
    if (saveName !== undefined) {
        return session.run(
            'MATCH (state:Debug:DebugState:`' + gameID + '`{saveName: $saveName})-[:STORES_OBJECT]->(object:DebugObject) ' +
            'RETURN saveName, state, collect(object) AS objects', {saveName: saveName}
        ).then(result => {
            const record = result.records[0];
            const saveName = record.get('saveName').properties.saveName;
            const currentScene = record.get('state').properties.currentScene;
            const objectsStates = record.get('objects').map(obj => obj.properties);

            const debugState = new DebugState({
                saveName: saveName,
                currentScene: currentScene,
                objectStates: objectsStates,
            })

            if (debugState)
                return debugState;
            else
                throw {message: 'state not found', status: 404};
        })
    } else {
        return session.run(
            'MATCH (state:Debug:DebugState:`' + gameID + '`)-[:STORES_OBJECT]->(object:DebugObject) ' +
            'RETURN state.saveName AS saveName, state, collect(object) AS objects'
        ).then(result => {
                const record = result.records[0];
            if(record) {
                const saveName = record.get('saveName');
                const currentScene = record.get('state').properties.currentScene;
                const objectsStates = record.get('objects').map(obj => obj.properties);

                const debugState = new DebugState({
                    saveName: saveName,
                    currentScene: currentScene,
                    objectStates: objectsStates,
                })

                if (debugState)
                    return debugState;
                else
                    throw {message: 'state not found', status: 404};
            }
        })
    }
}

module.exports = {
    createUpdateDebugState: createUpdateDebugState,
    getDebugState: getDebugState,
}