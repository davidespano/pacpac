const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');
const _ = require('lodash');

//create or modify a transition
async function createUpdateTransition(session, transition, sceneName, gameID) {
    const rules = transition.rules;
    const transaction = session.beginTransaction();
    delete transition.rules;
    try {
        const res_transition = await transaction.run(
            'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
            'MERGE (s)-[:CONTAINS]->(t:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
            'ON CREATE SET t += $transition , t.new = TRUE ' +
            'ON MATCH SET t += $transition, t.new = FALSE ' +
            'RETURN t',
            {sceneName: sceneName, uuid: transition.uuid, transition: transition}
        );
        const rul_acts = {};
        const res_rules = await Promise.all(rules.map(rule => {
            rul_acts[rule.uuid] = rule.actions;
            delete rule.actions;
            return transaction.run(
                'MATCH (t:InteractiveObject:Transition:`' + gameID + '` {uuid: $tuuid}) ' +
                'MERGE (t)-[:CONTAINS_RULE]->(r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'ON CREATE SET r += $rule , r.new = TRUE ' +
                'ON MATCH SET r += $rule, r.new = FALSE ' +
                'RETURN r',
                {tuuid: transition.uuid, ruuid: rule.uuid, rule: rule}
            );
        }));
        const res_actions = await Promise.all(_.map(rul_acts, (action, rule_uuid) => {
            console.log(rule_uuid);console.log(action)
            return transaction.run(
                'MATCH (r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                'MERGE (r)-[:CONTAINS_ACTION]->(a:Action:`' + gameID + '` {uuid: $auuid}) ' +
                'ON CREATE SET a += $act , a.new = TRUE ' +
                'ON MATCH SET a += $act, a.new = FALSE ' +
                'RETURN a',
                {ruuid: rule_uuid, auuid: action.uuid, act: action}
            )
        }));
        transaction.commit();
    } catch (error) {
        console.log(error);
        transaction.rollback();
    }
    return 55;
}

module.exports = {
    createUpdateTransition: createUpdateTransition
};


/*
* const Rule = require('../models/neo4j/rule');
const InteractiveObject = require('../models/neo4j/interactiveObject');

//create or modify a transition
function createUpdateTransition(session, transition, sceneName, gameID) {
    const rules = transition.rules;
    const transaction = session.beginTransaction();
    delete transition.rules;
    return transaction.run(
        'MATCH (s:Scene:`' + gameID + '` {name: $sceneName}) ' +
        'MERGE (s)-[:CONTAINS]->(t:InteractiveObject:Transition:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET t += $transition , t.new = TRUE ' +
        'ON MATCH SET t += $transition, t.new = FALSE ' +
        'RETURN t',
        {sceneName: sceneName, uuid: transition.uuid, transition: transition}
    ).then(result => {
        const promises = [];
        rules.forEach(rule => {
            actions = rule.actions;
            delete rule.actions;
            // this lambda trick is the only way to execute the query
            const promise = (() => {
                transaction.run(
                    'MATCH (t:InteractiveObject:Transition:`' + gameID + '` {uuid: $tuuid}) ' +
                    'MERGE (t)-[:CONTAINS_RULE]->(r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                    'ON CREATE SET r += $rule , r.new = TRUE ' +
                    'ON MATCH SET r += $rule, r.new = FALSE ' +
                    'RETURN r',
                    {tuuid: transition.uuid, ruuid: rule.uuid, rule: rule}
                ).then(() => {
                    console.log('then rule');
                    const promisesActs = [];
                    actions.forEach(action => {
                        const promiseAct = (() => {
                            transaction.run(
                                'MATCH (r:Rule:`' + gameID + '` {uuid: $ruuid}) ' +
                                'MERGE (r)-[:CONTAINS_ACTION]->(a:Action:`' + gameID + '` {uuid: $auuid}) ' +
                                'ON CREATE SET a += $act , a.new = TRUE ' +
                                'ON MATCH SET a += $act, a.new = FALSE ' +
                                'RETURN a',
                                {ruuid: rule.uuid, auuid: action.uuid, act: action}
                            )
                        })();
                        promisesActs.push(promiseAct)
                    });
                    return Promise.all(promisesActs);
                }).catch(e => {
                    console.log(e);
                    console.log('catch rule')
                    transaction.rollback();
                })
            })();
            promises.push(promise);
        });
        Promise.all(promises)
            .then(result => {
                console.log('committing');
                transaction.commit();
                return result;
            })
            .catch(e => {
                console.log(e);
                transaction.rollback();
            })
    }).catch(error => {
        console.log("error after transition")
        console.log(error);
        transaction.rollback();
    })
}

module.exports = {
    createUpdateTransition: createUpdateTransition
};*/