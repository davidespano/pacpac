function checkGameID(req, res, next, gameID) {
    if (gameID) {
        const re = /^[0-9A-Fa-f]{32}$/g;

        if (!re.test(gameID)) {
            res.sendStatus(404);
        }
    }
    next();
}

module.exports = {
    checkGameID: checkGameID
};