var writeError = require('../helpers/response').writeResponse;

module.exports = function loginRequired(req, res, next) {
  console.log("log");
  next();
};
