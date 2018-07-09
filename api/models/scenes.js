var _ = require('lodash');
var Scene = require('../models/neo4j/scene');
var Tag = require('../models/neo4j/tag');

// return many scenes
function manyScenes(neo4jResult) {
    return neo4jResult.records.map(record => {
        var result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    })
}

var _singleSceneWithDetails = function (record) {
    if (record.length) {
        var result = {};
        _.extend(result, new Scene(record.get('scene')));
        result.tag = new Tag(record.get('tag'));
        return result;
    } else {
        return null;
    }
};

// get all scenes
var getAll = function (session) {
    return session.run(
        'MATCH (scene:Scene) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag')
        .then(result => manyScenes(result));
};

//get scene by name
var getByName = function (session, name){
    return session.run(
        'MATCH (scene:Scene {name:$name}) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag', {'name':name})
        .then(result => {
            if(!_.isEmpty(result.records))
            {
                return _singleSceneWithDetails(result.records[0]);
            }
            else
            {
                throw {message: 'scene not found', status: 404};
            }
        });
}

//get the home scene
var getHomeScene = function (session){
    return session.run(
        'MATCH (scene:Scene:Home) ' +
        'OPTIONAL MATCH (scene)-[:TAGGED_AS]->(tag:Tag) ' +
        'RETURN scene,tag')
        .then(result => {
            if(!_.isEmpty(result.records))
            {
                return _singleSceneWithDetails(result.records[0]);
            }
            else
            {
                throw {message: 'scene not found', status: 404};
            }});
}

//add a scene
var addScene = function (session, name, tagColor, tagName)
{
    return session.run(
        'MATCH (scene:Scene {name: $name})' +
        'RETURN scene', {name: name, tagColor: tagColor, tagName: tagName})
        .then(result => {
            if(!_.isEmpty(result.records))
            {
                throw {message: "Scene already exists", status: 422};
            }
            else
            {
                return session.run(
                    'MERGE (tag:Tag {color: $tagColor, name:$tagName}) ' +
                    'CREATE (scene:Scene {name: $name}) -[:TAGGED_AS]-> (tag) ' +
                    'RETURN scene,tag', {name: name, tagColor: tagColor, tagName: tagName})
            }
        })
        .then(result => _singleSceneWithDetails(result.records[0]));

}

// get adjacent scenes
var getNeighboursByName = function (session, name) {
    //TODO Questa sarà da rifare con il sistema delle regole
    return session.run('MATCH (:Scene {name: $name})-[]->(scene) RETURN scene', {name: name})
        .then(result => manyScenes(result));
};

//delete a scene
var deleteScene = function (session, name) {
    return session.run(
        'MATCH (scene:Scene {name: $name}) ' +
        'DETACH DELETE scene ' +
        'RETURN COUNT(scene)', {name: name})
        .then(result => result.records[0].get('COUNT(scene)').low)
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    addScene: addScene,
    getHomeScene: getHomeScene,
    getNeighboursByName: getNeighboursByName,
    deleteScene: deleteScene
};