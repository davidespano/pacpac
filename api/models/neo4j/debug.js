// extracts just the data from the query results
const _ = require('lodash');
const assert = require('assert');

var Debug = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.name, "the scene must have a name");
};