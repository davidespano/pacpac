var _ = require('lodash');
var Scene = require('../models/neo4j/scene');

// return many scenes
function manyScenes(neo4jResult) {
    return neo4jResult.records.map(r => new Scene(r.get('scene')))
}

var _singleSceneWithDetails = function (record) {
    if (record.length) {
        var result = {};
        _.extend(result, new Scene(record.get('scene')));
        return result;
    } else {
        return null;
    }
};

// get all scenes
var getAll = function (session) {
    return session.run('MATCH (scene:Scene) RETURN scene')
        .then(result => manyScenes(result));
};

//get scene by name
var getByName = function (session, name){
    return session.run('MATCH (scene:Scene {name:$name}) RETURN scene', {'name':name})
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

//get the home scene
var getHomeScene = function (session){
    return session.run('MATCH (scene:Scene:Home) RETURN scene')
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
var addScene = function (session, name, description)
{
    return session.run('CREATE (scene:Scene {name: $name, description: $description}) RETURN scene',{name: name, description: description})
        .then(result => _singleSceneWithDetails(result.records[0]),
              error => {
                throw {message: error.message, status: 422};
              });
}

// get adjacent scenes
var getNeighboursByName = function (session, name) {
    return session.run('MATCH (:Scene {name: $name})-[]->(scene) RETURN scene', {name: name})
        .then(result => manyScenes(result));
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    addScene: addScene,
    getHomeScene: getHomeScene,
    getNeighboursByName: getNeighboursByName
};