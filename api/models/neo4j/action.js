const _ = require('lodash');
const assert = require('assert');

const Action = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.uuid, "the action must have a uuid");
};