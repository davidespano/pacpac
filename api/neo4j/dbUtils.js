// neo4j cypher helper module
const nconf = require('../config');

const neo4j = require('neo4j-driver');
let driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));

if (nconf.get('neo4j') == 'remote') {
    driver = neo4j.driver(nconf.get('neo4j-remote'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));
}

function getSession(context) {
    if (context.neo4jSession) {
        return context.neo4jSession;
    }
    else {
        context.neo4jSession = driver.session();
        return context.neo4jSession;
    }
}

function dbWhere(name, keys) {
    if (_.isArray(name)) {
        _.map(name, (obj) => {
            return _whereTemplate(obj.name, obj.key, obj.paramKey);
        });
    } else if (keys && keys.length) {
        return 'WHERE ' + _.map(keys, (key) => {
            return _whereTemplate(name, key);
        }).join(' AND ');
    }
}

function whereTemplate(name, key, paramKey) {
    return name + '.' + key + '={' + (paramKey || key) + '}';
}

module.exports = {
    getSession: getSession,
    dbWhere: dbWhere
};