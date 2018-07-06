// extracts just the data from the query results

var _ = require('lodash');

var Scene = module.exports = function (_node) {
    _.extend(this, _node.properties);

};