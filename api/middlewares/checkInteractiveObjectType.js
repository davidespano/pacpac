function checkInteractiveObjectType(req, res, next, objType) {
    if (objType) {
        const validObjs = ['transitions','switches'];
        if (!validObjs.includes(objType)) {
            res.sendStatus(404);
        }
        else {
            const conversion = {
                transitions: 'Transition',
                switches: 'Switch'
            };
            req.params.objectType = conversion[objType];
            next();
        }
    }
    else {
        next();
    }
}

module.exports = {
    checkInteractiveObjectType: checkInteractiveObjectType
};