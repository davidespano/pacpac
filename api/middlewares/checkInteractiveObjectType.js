function checkInteractiveObjectType(req, res, next, objType) {
    if (objType) {
        const validObjs = ['transitions','switches','collectable_keys','locks','points','counters', 'textboxes',
            'buttons', 'selectors', 'keypads', 'timers', 'health', 'flags', 'numbers', 'score', 'playtime'];
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
                buttons: 'Button',
                selectors: "Selector",
                keypads: "Keypad",
                timers: "Timer",
                score: "Score",
                playtime : "PlayTime",
                health : "Health",
                flags: "flag",
                numbers: "number",
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