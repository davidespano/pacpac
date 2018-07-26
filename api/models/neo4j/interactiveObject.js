const _ = require('lodash');

const InteractiveObject = module.exports = function (_node) {
    _.extend(this, _node.properties);
};