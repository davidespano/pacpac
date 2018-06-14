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

module.exports = {
    getAll: getAll,
    getByName: getByName
};