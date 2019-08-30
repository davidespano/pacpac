import Values from "./Values";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Immutable from "immutable";

const RuleActionTypes = {

    CHANGE_BACKGROUND: 'CHANGE_BACKGROUND',
    CHANGE_STATE: 'CHANGE_STATE',
    CHANGE_VISIBILITY : 'CHANGE_VISIBILITY',
    COLLECT_KEY: 'COLLECT_KEY',
    CLICK: 'CLICK',
    DECREASE: 'DECREASE',
    INCREASE: 'INCREASE',
    LOOK_AT: 'LOOK_AT',
    OFF : 'OFF',
    ON : 'ON',
    PLAY: 'PLAY',
    PLAY_LOOP: 'PLAY_LOOP',
    STOP: 'STOP',
    TRANSITION : 'TRANSITION',
    UNLOCK_LOCK: 'UNLOCK_LOCK',
};

export default RuleActionTypes;