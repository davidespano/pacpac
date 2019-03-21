const RuleActionTypes = {

    OFF : 'OFF',
    ON : 'ON',
    TRANSITION : 'TRANSITION',
    FLIP_SWITCH: 'FLIP_SWITCH',
    CHANGE_BACKGROUND: 'CHANGE_BACKGROUND',
    PLAY_AUDIO: 'PLAY_AUDIO',
    STOP_AUDIO: 'STOP_AUDIO',
    COLLECT_KEY: 'COLLECT_KEY',
    UNLOCK_LOCK: 'UNLOCK_LOCK',
    CLICK: 'CLICK',
};

export default RuleActionTypes;

/** TODO: la struttura dell'azione change-background:
 * {
 * uuid: ....,
 * targetScene: nome della scena a cui cambiare sfondo, (Senza estensione)
 * media: nome del video da sostituire (con estensione)
 * }
 * */

/** TODO: la struttura dell'azione play-audio:
 * {
 * uuid: ....,
 * media: nome del'audio da riprodurre, con estenesione
 * loop: se l'audio deve andare in loop o no, decidere come farlo finire
 * }
 * */

/** TODO: la struttura dell'azione stop-audio:
 * {
 * uuid: ....,
 * media: nome del'audio da stoppare, con estenesione
 * }
 * */

/** TODO: la struttura dell'azione collect-key:
 * {
 * uuid: ....,
 * keyUuid: uuid della chiave da raccogliere
 * }
 * */

/** TODO: la struttura dell'azione unlock-lock:
 * {
 * uuid: ....,
 * lockUuid uuid del lucchetto da sbloccare
 * }
 * */
