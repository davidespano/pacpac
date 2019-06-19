// extracts just the data from the query results
const _ = require('lodash');
const assert = require('assert');

let DebugState = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.currentScene, "the debug state must contain the current scene id");
    assert(this.objectStates, "the debug state must contain the state of objects");
};