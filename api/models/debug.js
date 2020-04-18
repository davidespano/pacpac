const _ = require('lodash');
const DebugState = require('../models/neo4j/debugState');

function createUpdateDebugState(session, debugState, gameID) {
    let state = new DebugState(debugState);
    let objectStates = state.objectStates;
    let saveName = state.saveName;
    let saveDescription = state.saveDescription;

    delete state.saveName;
    delete state.saveDescription;
    delete state.objectStates;

    return session.run(
        'MERGE (state:Debug:DebugState:`' + gameID + '` {saveName: $saveName}) ' +
        'SET state += $state ' +
        'WITH state ' +
        'UNWIND $objectStates as object ' +
        'MERGE (o:Debug:DebugObject {uuid: object.uuid, saveName: $saveName}) ' +
        'SET o += object ' +
        'MERGE (state)-[:STORES_OBJECT]->(o) ' +
        'RETURN state', {saveName: saveName, saveDescription: saveDescription, state: state, objectStates: objectStates})
        .then(() => debugState);
}

function getAllSaves(session, gameID) {
    return session.run(
        'MATCH (state:Debug:DebugState:`' + gameID + '`)-[:STORES_OBJECT]->(object:DebugObject) ' +
        'RETURN state.saveName AS saveName, state.saveDescription AS saveDescription, state, collect(object) AS objects'
    ).then(result => {
        if (!_.isEmpty(result.records)) {
            return multipleSaves(result);
        } else {
            return [];
        }
    });
}

function getDebugState(session, gameID, saveName) {
    if (saveName !== undefined) {
        return session.run(
            'MATCH (state:Debug:DebugState:`' + gameID + '`)-[:STORES_OBJECT]->(object:DebugObject) ' +
            'WHERE state.saveName="'+ saveName +'" ' +
            'RETURN state, collect(object) AS objects', {}
        ).then(result => {
            const record = result.records[0];
            const currentScene = record.get('state').properties.currentScene;
            const objectsStates = record.get('objects').map(obj => obj.properties);

            const debugState = new DebugState({
                currentScene: currentScene,
                objectStates: objectsStates,
            });

            if (debugState)
                return debugState;
            else
                throw {message: 'state not found', status: 404};
        })
    }
}

function multipleSaves(result) {
    return result.records.map(record => buildSave(record));
}

function buildSave(record) {

    if (record !== undefined) {
        const saveName = record.get('saveName');
        const saveDescription = record.get('saveDescription');

        const currentScene = record.get('state').properties.currentScene;
        const objectsStates = record.get('objects').map(obj => obj.properties);

        const debugState = new DebugState({
            saveName: saveName,
            saveDescription: saveDescription,
            currentScene: currentScene,
            objectStates: objectsStates,
        });

        if (debugState)
            return debugState;
    } else
        return null;
}

module.exports = {
    createUpdateDebugState: createUpdateDebugState,
    getDebugState: getDebugState,
    getAllSaves: getAllSaves,
}