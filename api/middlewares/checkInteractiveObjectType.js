function checkInteractiveObjectType(req, res, next, objType) {
    if (objType) {
        const validObjs = ['transitions','switches','collectable_keys','locks','points','counters',"textboxes"];
        if (!validObjs.includes(objType)) {
            res.sendStatus(404);
        }
        else {
            const conversion = {
                transitions: 'Transition',
                switches: 'Switch',
                collectable_keys: 'Key',
                locks: 'Lock',
                points: 'PointOfInterest',
                counters: 'Counter',
                textboxes: "Textbox",
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