const _ = require('lodash');
const assert = require('assert');

var Collection = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.name, "the collection must have a name");
};