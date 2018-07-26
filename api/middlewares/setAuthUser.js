const writeError = require('../helpers/response').writeError;
const Users = require('../models/users');
const dbUtils = require('../neo4j/dbUtils');

function setAuthUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        req.user = {id: null};
        next();
    }
    else {
        const match = authHeader.match(/^Token (\S+)/);
        if (!match || !match[1]) {
            return writeError(res, {detail: 'invalid authorization format. Follow `Token <token>`'}, 403);
        }
        const token = match[1];

        Users.me(dbUtils.getSession(req), token)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(() => res.sendStatus(403));
    }
}

module.exports = {
    setAuthUser: setAuthUser
};