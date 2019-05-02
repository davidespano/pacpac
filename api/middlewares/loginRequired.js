function loginRequired(req, res, next) {
    const user = req.user;
    if (user.id == null) {
        res.sendStatus(403)
    } else {
        const gameIDs = user.games.map( g => g.gameID);
        if (req.params.gameID && !gameIDs.includes(req.params.gameID)) {
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