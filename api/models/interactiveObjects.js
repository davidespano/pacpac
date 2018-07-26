const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');

//create or modify a transition
function createUpdateTransition(session, transition, sceneName, gameID){
    return session.run(
        'MATCH (s:Scene:`' + gameID + '` {name: sceneName}) ' +
        'MERGE (s)-[:CONTAINS]->(t:InteractiveObject:Transition {uuid: $uuid}) ' +
        'ON CREATE SET t += $transition RETURN T, true as new ' +
        'ON MERGE SET t += $transition RETURN T, false as new ',
        {sceneName:sceneName, uuid: transition.uuid, transition: transition}
    )
}

module.exports = {
    createUpdateTransition: createUpdateTransition
};