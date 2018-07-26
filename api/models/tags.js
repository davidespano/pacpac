const _ = require('lodash');
const Tag = require('../models/neo4j/tag');

// return many tags
function manyTag(neo4jResult) {
    return neo4jResult.records.map(r => new Tag(r.get('tag')))
}

function singleTagWithDetails(record) {
    if (record.length) {
        const result = {};
        _.extend(result, new Tag(record.get('tag')));
        return result;
    } else {
        return null;
    }
}

// get all tags
function getAll(session, gameID) {
    return session.run('MATCH (tag:Tag:`' + gameID + '`) RETURN tag')
        .then(result => manyTag(result));
}

module.exports = {
    getAll: getAll,
};