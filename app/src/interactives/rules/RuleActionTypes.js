import Values from "./Values";
import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Immutable from "immutable";

const RuleActionTypes = {

    CHANGE_BACKGROUND: 'CHANGE_BACKGROUND',
    CHANGE_STATE: 'CHANGE_STATE',
    CHANGE_VISIBILITY : 'CHANGE_VISIBILITY',
    COLLECT_KEY: 'COLLECT_KEY',
    CLICK: 'CLICK',
    LOOK_AT: 'LOOK_AT',
    OFF : 'OFF',
    ON : 'ON',
    PLAY_AUDIO: 'PLAY_AUDIO',
    PLAY_AUDIO_LOOP: 'PLAY_AUDIO_LOOP',
    STOP_AUDIO: 'STOP_AUDIO',
    TRANSITION : 'TRANSITION',
    UNLOCK_LOCK: 'UNLOCK_LOCK',
};

export default RuleActionTypes;