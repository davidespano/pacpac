const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');
const _ = require('lodash');

//create or modify a transition
async function createUpdateTransition(session, transition, sceneName, gameID){
    const result = await session.run(
        'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
        'MERGE (s)-[:CONTAINS_OBJECT]->(t:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET t += $transition , t.new__ = TRUE ' +
        'ON MATCH SET t += $transition ' +
        'WITH t, exists(t.new__) as isNew ' +
        'REMOVE t.new__ ' +
        'RETURN t, isNew',
        {sceneName: sceneName, uuid: transition.uuid, transition: transition}
    );
    const newObjs = result.records[0].get('isNew');
    return [transition, newObjs];
}

function deleteTransition(session, name, tuuid, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name})-[:CONTAINS_OBJECT]->(transition:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
        'DETACH DELETE transition ' +
        'RETURN COUNT(transition)', {name: name, uuid: tuuid})
        .then(result => result.records[0].get('COUNT(transition)').low)
}


module.exports = {
    createUpdateTransition: createUpdateTransition,
    deleteTransition: deleteTransition
};