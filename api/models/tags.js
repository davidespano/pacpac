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

//create or modify a transition
async function createUpdateTag(session, tag, gameID){
    const result = await session.run(
        'MERGE (tag:Tag:`' + gameID + '` {uuid: $uuid}) ' +
        'ON CREATE SET tag += $tag , tag.new__ = TRUE ' +
        'ON MATCH SET tag += $tag ' +
        'WITH tag, exists(tag.new__) as isNew ' +
        'REMOVE tag.new__ ' +
        'RETURN tag, isNew',
        {uuid: tag.uuid, tag: tag, tagColor: tag.color, tagName: tag.name}
    );
    const newObjs = result.records[0].get('isNew');
    return [tag, newObjs];
}

module.exports = {
    getAll: getAll,
    createUpdateTag: createUpdateTag
};