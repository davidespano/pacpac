import Values from "./Values";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Immutable from "immutable";

const RuleActionTypes = {

    CHANGE_ACTIVABILITY: 'CHANGE_ACTIVABILITY',
    CHANGE_BACKGROUND: 'CHANGE_BACKGROUND',
    CHANGE_STATE: 'CHANGE_STATE',
    CHANGE_VISIBILITY : 'CHANGE_VISIBILITY',
    COLLECT_KEY: 'COLLECT_KEY',
    CLICK: 'CLICK',
    DECREASE_STEP: 'DECREASE_STEP',
    INCREASE_STEP: 'INCREASE_STEP',
    INCREASE: 'INCREASE',
    IS: 'IS',
    LOOK_AT: 'LOOK_AT',
    OFF : 'OFF',
    ON : 'ON',
    PLAY: 'PLAY',
    PLAY_LOOP: 'PLAY_LOOP',
    STOP: 'STOP',
    TRANSITION : 'TRANSITION',
    UNLOCK_LOCK: 'UNLOCK_LOCK',
    TRIGGERS: 'AVVIA',

};

export default RuleActionTypes;