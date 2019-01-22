const RuleActionTypes = {

    OFF : 'OFF',
    ON : 'ON',
    TRANSITION : 'TRANSITION',
    FLIP_SWITCH: 'FLIP_SWITCH',
    CHANGE_BACKGROUND: 'CHANGE_BACKGROUND',
};

export default RuleActionTypes;

/** TODO: la struttura dell'azione change-background:
 * {
 * uuid: ....,
 * targetScene: nome della scena a cui cambiare sfondo, (Senza estensione)
 * media: nome del video da sostituire (con estensione)
 * }
 * */
