const _ = require('lodash');
const assert = require('assert');

var Story = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.name, "the story must have a name");
};