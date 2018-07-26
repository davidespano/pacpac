function loginRequired(req, res, next) {
    const user = req.user;
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
}

module.exports = {
    loginRequired: loginRequired
};