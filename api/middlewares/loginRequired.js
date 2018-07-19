var writeError = require('../helpers/response').writeResponse;

module.exports = function loginRequired(req, res, next) {
    user = req.user;
    if (user.id == null) {
        res.sendStatus(403)
    } else {
        if (!user.games.includes(req.params.gameID)) {
            res.sendStatus(403)
        }
        else {
            next()
        }
    }
};
