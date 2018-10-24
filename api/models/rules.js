const Rule = require('../models/neo4j/rule')
    , _ = require('lodash');

//create or modify a transition
async function createUpdateRule(session, rule, sceneName, gameID){
    const return_rule = _.cloneDeep(rule);
    const actions = rule.actions;
    const transaction = session.beginTransaction();
    delete rule.actions;
    rule.condition = JSON.stringify(rule.condition);
    let newObjs = false;
    try {
        const res_rule = await transaction.run(
            'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
            'MERGE (s)-[:CONTAINS_RULE]->(r:Rule:`' + gameID + '` {uuid: $uuid}) ' +
            'ON CREATE SET r += $rule , r.new__ = TRUE ' +
            'ON MATCH SET r += $rule ' +
            'WITH r, exists(r.new__) as isNew ' +
            'REMOVE r.new__ ' +
            'RETURN r, isNew',
            {sceneName: sceneName, uuid: rule.uuid, rule: rule}
        );
        newObjs = newObjs || res_rule.records[0].get('isNew');
        const res_actions = await Promise.all(actions.map(act => {
            return transaction.run(
                'MATCH (r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'MERGE (r)-[:CONTAINS_ACTION]->(a:Action:`' + gameID + '` {uuid: $auuid}) ' +
                'ON CREATE SET a += $act , a.new__ = TRUE ' +
                'ON MATCH SET a += $act ' +
                'WITH a ' +
                'OPTIONAL MATCH (a)-[t:TARGET]->(:Scene:`' + gameID + '`) ' +
                'DELETE t ' +
                'WITH a, exists(a.new__) as isNew ' +
                'REMOVE a.new__ ' +
                'RETURN a, isNew',
                {ruuid: rule.uuid, auuid: act.uuid, act: act, sceneName: act.target}
            )
        }));
        res_actions.forEach(result => {newObjs = newObjs || result.records[0].get('isNew');});
        const res_targets = await Promise.all(actions.filter(act => act.target).map(act => {
            return transaction.run(
                'MATCH (r:Rule:`' + gameID + '` {uuid: $ruuid}) -[:CONTAINS_ACTION]-> ' +
                '(a:Action:`' + gameID + '` {uuid: $auuid}) ' +
                'WITH a ' +
                'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
                'CREATE (a)-[l:TARGET]->(s) ' +
                'RETURN l',
                {ruuid: rule.uuid, auuid: act.uuid, act: act, sceneName: act.target}
            );
        }));
        transaction.commit();
        return [return_rule, newObjs];
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw ('Error creating the rule');
    }
}

function deleteRule(session, name, ruuid, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name})-[:CONTAINS_RULE]->' +
        '(rule:Rule:`' + gameID + '` {uuid: $uuid}) ' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(a:Action) ' +
        'DETACH DELETE rule, a ' +
        'RETURN COUNT(rule)', {name: name, uuid: ruuid})
        .then(result => result.records[0].get('COUNT(rule)').low)
}


module.exports = {
    createUpdateRule: createUpdateRule,
    deleteRule: deleteRule
};