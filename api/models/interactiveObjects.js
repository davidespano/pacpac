const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');

//create or modify a transition
function createUpdateTransition(session, transition, sceneName, gameID){
    const rules = transition.rules;
    const transaction = session.beginTransaction();
    delete transition.rules;
    return transaction.run(
        'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
        'MERGE (s)-[:CONTAINS]->(t:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET t += $transition , t.new = TRUE ' +
        'ON MATCH SET t += $transition, t.new = FALSE ' +
        'RETURN t',
        {sceneName:sceneName, uuid: transition.uuid, transition: transition}
    ).then(result => {
        const promises = [];
        rules.forEach(rule => {
            // this lambda trick is the only way to execute the query

            const promise = (() => {
                transaction.run(
                'MATCH (t:InteractiveObject:Transition:`' + gameID + '` {uuid: $tuuid}) ' +
                'MERGE (t)-[:CONTAINS_RULE]->(r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'ON CREATE SET r += $rule , r.new = TRUE ' +
                'ON MATCH SET r += $rule, r.new = FALSE ' +
                'RETURN r',
                {tuuid: transition.uuid, ruuid: rule.uuid, rule: rule})})();
            promises.push(promise);
        });
        Promise.all(promises)
            .then(result => {
                console.log('committing');
                transaction.commit();
                return result})
            .catch(e => {
                console.log(e);
                transaction.rollback()})
    }).catch(error => {
        console.log(error);
        transaction.rollback();
    })
}

module.exports = {
    createUpdateTransition: createUpdateTransition
};