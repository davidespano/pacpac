const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');
const _ = require('lodash');

//create or modify a transition
async function createUpdateTransition(session, transition, sceneName, gameID) {
    const return_transition = _.cloneDeep(transition);
    const rules = transition.rules;
    const transaction = session.beginTransaction();
    delete transition.rules;
    let newObjs = false;
    try {
        const res_transition = await transaction.run(
            'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
            'MERGE (s)-[:CONTAINS]->(t:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
            'ON CREATE SET t += $transition , t.new__ = TRUE ' +
            'ON MATCH SET t += $transition ' +
            'WITH t, exists(t.new__) as isNew ' +
            'REMOVE t.new__ ' +
            'RETURN t, isNew',
            {sceneName: sceneName, uuid: transition.uuid, transition: transition}
        );
        newObjs = newObjs || res_transition.records[0].get('isNew');
        const rul_acts = [];
        const res_rules = await Promise.all(rules.map(rule => {
            rule.actions.forEach(action => {rul_acts.push([rule.uuid, action])});
            delete rule.actions;
            rule.condition = JSON.stringify(rule.condition)
            return transaction.run(
                'MATCH (t:InteractiveObject:Transition:`' + gameID + '` {uuid: $tuuid}) ' +
                'MERGE (t)-[:CONTAINS_RULE]->(r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'ON CREATE SET r += $rule , r.new__ = TRUE ' +
                'WITH r, exists(r.new__) as isNew ' +
                'REMOVE r.new__ ' +
                'RETURN r, isNew',
                {tuuid: transition.uuid, ruuid: rule.uuid, rule: rule}
            );
        }));
        res_rules.forEach(result => {newObjs = newObjs || result.records[0].get('isNew');});
        const res_actions = await Promise.all(rul_acts.map(rul_act => {
            const rule_uuid = rul_act[0];
            const action = rul_act[1];
            console.log(action)
            return transaction.run(
                'MATCH (r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'MERGE (r)-[:CONTAINS_ACTION]->(a:Action:`' + gameID + '` {uuid: $auuid}) ' +
                'ON CREATE SET a += $act , a.new__ = TRUE ' +
                'ON MATCH SET a += $act ' +
                'WITH a ' +
                'OPTIONAL MATCH (a)-[t:TARGET]->(:Scene:`' + gameID + '`) ' +
                'DELETE t ' +
                'WITH a ' +
                'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
                'CREATE (a)-[:TARGET]->(s) ' +
                'WITH a, exists(a.new__) as isNew ' +
                'REMOVE a.new__ ' +
                'RETURN a, isNew',
                {ruuid: rule_uuid, auuid: action.uuid, act: action, sceneName: action.target}
            )
        }));
        console.log(res_actions)
        res_actions.forEach(result => {newObjs = newObjs || result.records[0].get('isNew');});
        transaction.commit();
        return [return_transition, newObjs];
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw ('Error creating the objects');
    }
}

module.exports = {
    createUpdateTransition: createUpdateTransition
};