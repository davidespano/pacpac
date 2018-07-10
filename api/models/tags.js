var _ = require('lodash');
var Tag = require('../models/neo4j/tag');

// return many tags
function manyTag(neo4jResult) {
    return neo4jResult.records.map(r => new Tag(r.get('tag')))
}

var _singleTagWithDetails = function (record) {
    if (record.length) {
        var result = {};
        _.extend(result, new Tag(record.get('tag')));
        return result;
    } else {
        return null;
    }
};

// get all tags
var getAll = function (session, gameID) {
    return session.run('MATCH (tag:Tag:`'+ gameID +'`) RETURN tag')
        .then(result => manyTag(result));
};

module.exports = {
    getAll: getAll,
};