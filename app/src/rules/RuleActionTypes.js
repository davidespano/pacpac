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
    DECREASE_NUMBER: 'DECREASE_NUMBER',
    DECREASE_STEP: 'DECREASE_STEP',
    ENTER_SCENE : 'ENTER_SCENE',
    INCREASE_NUMBER: 'INCREASE_NUMBER',
    INCREASE_STEP: 'INCREASE_STEP',
    INCREASE: 'INCREASE',
    IS: 'IS',
    LOOK_AT: 'LOOK_AT',
    OFF : 'OFF',
    ON : 'ON',
    PLAY: 'PLAY',
    PLAY_LOOP: 'PLAY_LOOP',
    PROGRESS: 'PROGRESS',
    REACH_TIMER : 'REACH_TIMER',
    RULES : 'REGOLA',
    STOP: 'STOP',
    STOP_TIMER: 'STOP_TIMER',
    TRANSITION : 'TRANSITION',
    TRIGGERS: 'TRIGGERS',
    UNLOCK_LOCK: 'UNLOCK_LOCK',

};

export default RuleActionTypes;