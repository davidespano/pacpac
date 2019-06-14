// extracts just the data from the query results
const _ = require('lodash');
const assert = require('assert');

var Asset = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.path, "the asset must have a path");
};