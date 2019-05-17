const Audio = require("./neo4j/audio")

function manyAudio(neo4jResult) {
    return neo4jResult.records.map(r => new Audio(r.get('audio')))
}
async function createUpdateLocalAudio(session, audio, sceneUuid, gameID){
    const result = await session.run(
        'MATCH (s:Scene:`' + gameID + '` {uuid: $sceneUuid}) ' +
        'MERGE (s)-[:CONTAINS_AUDIO]->(a:Audio:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET a += $audio , a.new__ = TRUE ' +
        'ON MATCH SET a += $audio ' +
        'WITH a, exists(a.new__) as isNew ' +
        'REMOVE a.new__ ' +
        'RETURN a as audio, isNew',
        {sceneUuid: sceneUuid, uuid: audio.uuid, audio: audio}
    );
    const newObjs = result.records[0].get('isNew');
    return [audio, newObjs];
}

async function createUpdateGlobalAudio(session, audio, gameID){
    const result = await session.run(
        'MATCH (g:Game {gameID: $gameID}) ' +
        'MERGE (g)-[:CONTAINS_AUDIO]->(a:Audio:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET a += $audio , a.new__ = TRUE ' +
        'ON MATCH SET a += $audio ' +
        'WITH a, exists(a.new__) as isNew ' +
        'REMOVE a.new__ ' +
        'RETURN a, isNew',
        {gameID: gameID, uuid: audio.uuid, audio: audio}
    );
    const newObjs = result.records[0].get('isNew');
    return [audio, newObjs];
}

function getAll(session, gameID){
    return session.run(
        'MATCH (a:Audio:`' + gameID + '`)' +
        'RETURN a as audio').then(result => manyAudio(result));
}

module.exports = {
    createUpdateGlobalAudio: createUpdateGlobalAudio,
    createUpdateLocalAudio: createUpdateLocalAudio,
    getAll: getAll,
};