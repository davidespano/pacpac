// extracts just the data from the query results

var _ = require('lodash');

var Tag = module.exports = function (_node) {
    if(_node)
        _.extend(this, _node.properties);


};