var writeError = require('../helpers/response').writeError;


module.exports = function checkGameID(req, res, next, gameID) {
    if(gameID) {
        var re = /^[0-9A-Fa-f]{32}$/g;

        if (!re.test(gameID)) {
            res.sendStatus(404);
        }
    }
    next();
}