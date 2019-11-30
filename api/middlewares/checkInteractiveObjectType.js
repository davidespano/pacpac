function checkInteractiveObjectType(req, res, next, objType) {
    if (objType) {
        const validObjs =
        [
            'transitions','switches','collectable_keys','locks','points','counters','devices',
            'blinds', 'doors', 'acs', 'lights', 'motiondects', 'powoutlets', 'dswitches', 'sensors', 'sirens', 'smokedects', 'speakers'
        ];

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

                // IoT Devices
                blinds: "Blinds",
                doors: "Doors",
                acs: "Acs",
                lights: "Lights",
                motiondects: "Motiondects",
                powoutlets: "Powoutlets",
                dswitches: "Dswitches",
                sensors: "Sensors",
                sirens: "Sirens",
                smokedects: "Smokedects",
                speakers: "Speakers",

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
