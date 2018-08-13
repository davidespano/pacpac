const _ = require('lodash');
const Scene = require('../models/neo4j/scene');
const Tag = require('../models/neo4j/tag');

// return many scenes
function manyScenes(neo4jResult) {
    return neo4jResult.records.map(record => {
        const result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    })
}

function singleSceneWithDetails(record) {
    if (record.length) {
        const result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    } else {
        return null;
    }
}

// get all scenes
function getAll(session, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '`) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag')
        .then(result => {
                if (!_.isEmpty(result.records)) {
                    return manyScenes(result);
                }
                else {
                    throw {message: "gameID not found", status: 404}
                }
            }

            , error => {
            });
}

//get scene by name
function getByName(session, name, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name:$name}) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'OPTIONAL MATCH (scene)-[:CONTAINS]->(object:InteractiveObject)' +
        'OPTIONAL MATCH (object)-[:CONTAINS_RULE]->(rule:Rule)' +
        'OPTIONAL MATCH (rule)-[:CONTAINS_ACTION]->(action:Action)' +
        'WITH scene, tag, object, ' +
        '           { ' +
        '                  condition: rule.condition, ' +
        '                  event: rule.event,' +
        '                  uuid: rule.uuid,' +
        '                  actions: COLLECT(properties(action))' +
        '           } AS rule ' +
        'WITH scene, tag, ' +
        '           { ' +
        '                  name: object.name, ' +
        '                  uuid: object.uuid,' +
        '                  rules: COLLECT(rule)' +
        '           } AS object ' +
        'RETURN {' +
        '           properties: {' +
        '                           name: scene.name, ' +
        '                           objects: COLLECT(object)' +
        '                        }' +
        '       } AS scene, tag', {'name': name})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                return singleSceneWithDetails(result.records[0]);
            }
            else {
                throw {message: 'scene not found', status: 404};
            }
        });
}

//get the home scene
function getHomeScene(session, gameID) {
    return session.run(
        'MATCH (scene:Scene:Home:`' + gameID + '`) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag')
        .then(result => {
            if (!_.isEmpty(result.records)) {
                return singleSceneWithDetails(result.records[0]);
            }
            else {
                throw {message: 'scene not found', status: 404};
            }
        });
}

//add a scene
function addScene(session, name, tagColor, tagName, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name})' +
        'RETURN scene', {name: name, tagColor: tagColor, tagName: tagName})
        .then(result => {
            if (!_.isEmpty(result.records)) {
                throw {message: "Scene already exists", status: 422};
            }
            else {
                return session.run(
                    'MERGE (tag:Tag:`' + gameID + '` {color: $tagColor, name:$tagName}) ' +
                    'CREATE (scene:Scene:`' + gameID + '` {name: $name}) -[:TAGGED_AS]-> (tag) ' +
                    'RETURN scene,tag', {name: name, tagColor: tagColor, tagName: tagName})
            }
        })
        .then(result => singleSceneWithDetails(result.records[0]));

}

// get adjacent scenes
function getNeighboursByName(session, name, gameID) {
    //TODO Questa sarà da rifare con il sistema delle regole
    return session.run('MATCH (:Scene:`' + gameID + '` {name: $name})-[]->(scene) RETURN scene', {name: name})
        .then(result => manyScenes(result));
}

//delete a scene
function deleteScene(session, name, gameID) {
    return session.run(
        'MATCH (scene:Scene:`' + gameID + '` {name: $name}) ' +
        'DETACH DELETE scene ' +
        'RETURN COUNT(scene)', {name: name})
        .then(result => result.records[0].get('COUNT(scene)').low)
}

module.exports = {
    getAll: getAll,
    getByName: getByName,
    addScene: addScene,
    getHomeScene: getHomeScene,
    getNeighboursByName: getNeighboursByName,
    deleteScene: deleteScene
};