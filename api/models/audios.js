const Audio = require("./neo4j/audio")

function manyAudio(neo4jResult) {
    return neo4jResult.records.map(r => new Audio(r.get('audio')))
}
async function createUpdateLocalAudio(session, audio, sceneUuid, gameID){
    const result = await session.run(
        'MATCH (s:Scene:`' + gameID + '` {uuid: $sceneUuid}) ' +
        'MERGE (a:Audio:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET a += $audio , a.new__ = TRUE ' +
        'ON MATCH SET a += $audio ' +
        'WITH s, a ' +
        'OPTIONAL MATCH (a)-[r]-() ' +
        'MERGE (s)-[:CONTAINS_AUDIO]->(a) ' +
        'WITH a, r, exists(a.new__) as isNew ' +
        'REMOVE a.new__ ' +
        'DELETE r ' +
        'RETURN a, isNew',
        {sceneUuid: sceneUuid, uuid: audio.uuid, audio: audio}
    );
    const newObjs = result.records[0].get('isNew');
    return [audio, newObjs];
}

async function createUpdateGlobalAudio(session, audio, gameID){
    const result = await session.run(
        'MATCH (g:Game {gameID: $gameID}) ' +
        'MERGE (a:Audio:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET a += $audio , a.new__ = TRUE ' +
        'ON MATCH SET a += $audio ' +
        'WITH g, a ' +
        'OPTIONAL MATCH (a)-[r]-() ' +
        'MERGE (g)-[:CONTAINS_AUDIO]->(a) ' +
        'WITH a, r, exists(a.new__) as isNew ' +
        'REMOVE a.new__ ' +
        'DELETE r ' +
        'RETURN a, isNew',
        {gameID: gameID, uuid: audio.uuid, audio: audio}
    );
    const newObjs = result.records[0].get('isNew');
    return [audio, newObjs];
}

function getAll(session, gameID){
    return session.run(
        'MATCH (audio:Audio:`' + gameID + '`)' +
        'RETURN audio').then(result => manyAudio(result));
}

function deleteAudio(session, uuid, gameID){
    return session.run(
        'MATCH (audio:Audio:`' + gameID + '` {uuid: $uuid}) ' +
        'DETACH DELETE audio ' +
        'RETURN COUNT(audio)', {uuid: uuid})
        .then(result => result.records[0].get('COUNT(audio)').low)
}

module.exports = {
    createUpdateGlobalAudio: createUpdateGlobalAudio,
    createUpdateLocalAudio: createUpdateLocalAudio,
    getAll: getAll,
    deleteAudio: deleteAudio,
};