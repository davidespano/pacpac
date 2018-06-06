var _ = require('lodash');
var Scene = require('../models/neo4j/scene');

// return many scenes
function _manyScenes(neo4jResult) {
    return neo4jResult.records.map(r => new Scene(r.get('scene')))
}

// get all scenes
var getAll = function (session) {
    return session.run('MATCH (scene:Scene) RETURN scene')
        .then(result => _manyScenes(result));
};

module.exports = {
    getAll: getAll
};