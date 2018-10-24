// extracts just the data from the query results
const Action = require("./action");
const _ = require('lodash');
const assert = require('assert');

var Rule = module.exports = function (_node) {
    if(_node.properties) {
        _.extend(this, _node.properties);
    } else {
        _.extend(this, _node);
    }
    assert(this.uuid, "the rule must have a uuid");
    if(!this.actions) this.actions = [];
    this.actions = this.actions.map(a => new Action(a))
};