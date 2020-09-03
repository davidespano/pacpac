import Immutable from "immutable";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import toString from "./toString";
import RuleActionTypes from "./RuleActionTypes";
import Values from "./Values";
import {Operators} from "./Operators";

const RuleActionMap = Immutable.Map([
    [
        RuleActionTypes.CLICK,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.SELECTOR
            ],
            name: toString.eventTypeToString(RuleActionTypes.CLICK),
            uuid: RuleActionTypes.CLICK
        },
    ],
    [
        RuleActionTypes.COLLECT_KEY,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.KEY],
            name: toString.eventTypeToString(RuleActionTypes.COLLECT_KEY),
            uuid: RuleActionTypes.COLLECT_KEY
        }
    ],
    [
        RuleActionTypes.UNLOCK_LOCK,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.LOCK],
            name: toString.eventTypeToString(RuleActionTypes.UNLOCK_LOCK),
            uuid: RuleActionTypes.UNLOCK_LOCK
        }
    ],
    [
        RuleActionTypes.TRANSITION,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [Values.THREE_DIM, Values.TWO_DIM],
            name: toString.eventTypeToString(RuleActionTypes.TRANSITION),
            uuid: RuleActionTypes.TRANSITION
        }
    ],
    [
        RuleActionTypes.ON,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.SWITCH],
            name: toString.eventTypeToString(RuleActionTypes.ON),
            uuid: RuleActionTypes.ON
        }
    ],
    [
        RuleActionTypes.OFF,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.SWITCH],
            name: toString.eventTypeToString(RuleActionTypes.OFF),
            uuid: RuleActionTypes.OFF
        }
    ],
    [
        RuleActionTypes.CHANGE_BACKGROUND,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['video', 'img'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_BACKGROUND),
            uuid: RuleActionTypes.CHANGE_BACKGROUND
        },
    ],
    [
        RuleActionTypes.CHANGE_STATE,
        {
            type: "operation",
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
            ],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_STATE),
            uuid: RuleActionTypes.CHANGE_STATE,
        },
    ],
    [
        RuleActionTypes.CHANGE_VISIBILITY,
        {
            type: "operation",
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.BUTTON
            ],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_VISIBILITY),
            uuid: RuleActionTypes.CHANGE_VISIBILITY,
        },
    ],
    [
        RuleActionTypes.CHANGE_ACTIVABILITY,
        {
            type: "operation",
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.BUTTON
            ],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_ACTIVABILITY),
            uuid: RuleActionTypes.CHANGE_ACTIVABILITY,
        },
    ],
    [
        RuleActionTypes.PLAY,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio'],
            name: toString.eventTypeToString(RuleActionTypes.PLAY),
            uuid: RuleActionTypes.PLAY,
        },
    ],
    [
        RuleActionTypes.PLAY_LOOP,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio'],
            name: toString.eventTypeToString(RuleActionTypes.PLAY_LOOP),
            uuid: RuleActionTypes.PLAY_LOOP,
        },
    ],
    [
        RuleActionTypes.STOP,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio'],
            name: toString.eventTypeToString(RuleActionTypes.STOP),
            uuid: RuleActionTypes.STOP,
        },
    ],
    [
        RuleActionTypes.LOOK_AT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.POINT_OF_INTEREST],
            name: toString.eventTypeToString(RuleActionTypes.LOOK_AT),
            uuid: RuleActionTypes.LOOK_AT
        },
    ],
    [
        RuleActionTypes.INCREASE_STEP,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.COUNTER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.INCREASE_STEP),
            uuid: RuleActionTypes.INCREASE_STEP,
        },
    ],
    [
        RuleActionTypes.INCREASE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.SCORE, InteractiveObjectsTypes.PLAYTIME],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.INCREASE),
            uuid: RuleActionTypes.INCREASE,
        },
    ],
    [
        RuleActionTypes.DECREASE_STEP,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.COUNTER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.DECREASE_STEP),
            uuid: RuleActionTypes.DECREASE_STEP,
        },
    ],
    [
        RuleActionTypes.IS,
        {
            type: "operation",
            subj_type: ['audio', 'video'],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.IS),
            uuid: RuleActionTypes.IS,
        },
    ],
    [
        RuleActionTypes.TRIGGERS,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.GAME],
            obj_type: [InteractiveObjectsTypes.RULES, InteractiveObjectsTypes.TIMER],
            name: toString.eventTypeToString(RuleActionTypes.TRIGGERS),
            uuid: RuleActionTypes.TRIGGERS,
        },
    ],
    [
        RuleActionTypes.REACH_TIMER,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.TIMER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.REACH_TIMER),
            uuid: RuleActionTypes.REACH_TIMER,
        },
    ],
    [
        RuleActionTypes.ENTER_SCENE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [Values.TWO_DIM],
            name: toString.eventTypeToString(RuleActionTypes.ENTER_SCENE),
            uuid: RuleActionTypes.ENTER_SCENE,
        },
    ],
    [
        RuleActionTypes.STOP_TIMER,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.GAME],
            obj_type: [InteractiveObjectsTypes.TIMER],
            name: toString.eventTypeToString(RuleActionTypes.STOP_TIMER),
            uuid: RuleActionTypes.STOP_TIMER,
        },
    ],
    [
        RuleActionTypes.INCREASE_NUMBER,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.HEALTH, InteractiveObjectsTypes.SCORE],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.INCREASE_NUMBER),
            uuid: RuleActionTypes.INCREASE_NUMBER,
        },
    ],
    [
        RuleActionTypes.DECREASE_NUMBER,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.HEALTH, InteractiveObjectsTypes.SCORE],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.DECREASE_NUMBER),
            uuid: RuleActionTypes.DECREASE_NUMBER,
        },
    ],
    [
        RuleActionTypes.PROGRESS,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.SELECTOR],
            obj_type: [Values.STATE],
            name: toString.eventTypeToString(RuleActionTypes.PROGRESS),
            uuid: RuleActionTypes.PROGRESS,
        },
    ],
]);

const OperatorsMap = Immutable.Map([
    [
        Operators.EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.POINT_OF_INTEREST,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.COMBINATION,
                InteractiveObjectsTypes.SELECTOR
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL),
            uuid: Operators.EQUAL,
        },
    ],
    [
        Operators.NOT_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.POINT_OF_INTEREST,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL),
            uuid: Operators.NOT_EQUAL,
        },
    ],
    [
        Operators.EQUAL_NUM,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL_NUM),
            uuid: Operators.EQUAL_NUM,
        },
    ],
    [
        Operators.NOT_EQUAL_NUM,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL_NUM),
            uuid: Operators.NOT_EQUAL_NUM,
        },
    ],
    [
        Operators.LESS_EQUAL,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_EQUAL),
            uuid: Operators.LESS_EQUAL,
        },
    ],
    [
        Operators.LESS_THAN,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_THAN),
            uuid: Operators.LESS_THAN,
        },
    ],
    [
        Operators.GREATER_EQUAL,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_EQUAL),
            uuid: Operators.GREATER_EQUAL,
        },
    ],
    [
        Operators.GREATER_THAN,
        {
            subj_type: [InteractiveObjectsTypes.COUNTER, InteractiveObjectsTypes.HEALTH],
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_THAN),
            uuid: Operators.GREATER_THAN,
        },
    ],

]);

const ValuesMap = Immutable.Map([
    [
        Values.VISIBLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.SELECTOR
            ],
            verb_type: [RuleActionTypes.CHANGE_VISIBILITY],
            name: toString.valueUuidToString(Values.VISIBLE),
            uuid: Values.VISIBLE,
        },

    ],
    [
        Values.ACTIVABLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.SELECTOR

            ],
            verb_type: [RuleActionTypes.CHANGE_ACTIVABILITY],
            name: toString.valueUuidToString(Values.ACTIVABLE),
            uuid: Values.ACTIVABLE,
        },

    ],
    [
        Values.NOT_ACTIVABLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.SELECTOR
            ],
            verb_type: [RuleActionTypes.CHANGE_ACTIVABILITY],
            name: toString.valueUuidToString(Values.NOT_ACTIVABLE),
            uuid: Values.NOT_ACTIVABLE,
        },

    ],
    [
        Values.INVISIBLE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.TRANSITION,
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.HEALTH,
                InteractiveObjectsTypes.SCORE,
                InteractiveObjectsTypes.PLAYTIME,
                InteractiveObjectsTypes.BUTTON,
                InteractiveObjectsTypes.KEYPAD,
                InteractiveObjectsTypes.SELECTOR
            ],
            verb_type: [RuleActionTypes.CHANGE_VISIBILITY],
            name: toString.valueUuidToString(Values.INVISIBLE),
            uuid: Values.INVISIBLE,
        },

    ],
    [
        Values.ON,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.SWITCH],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.ON),
            uuid: Values.ON,
        },

    ],
    [
        Values.OFF,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.SWITCH],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.OFF),
            uuid: Values.OFF,
        },

    ],
    [
        Values.LOCKED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.LOCK],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.LOCKED),
            uuid: Values.LOCKED,
        },

    ],
    [
        Values.UNLOCKED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.LOCK],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.UNLOCKED),
            uuid: Values.UNLOCKED,
        },

    ],
    [
        Values.COLLECTED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.KEY],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.COLLECTED),
            uuid: Values.COLLECTED,
        },

    ],
    [
        Values.NOT_COLLECTED,
        {
            type: 'value',
            subj_type: [InteractiveObjectsTypes.KEY],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.NOT_COLLECTED),
            uuid: Values.NOT_COLLECTED,
        },

    ],
    [
        Values.STARTED,
        {
            type: 'value',
            subj_type: ['audio', 'video'],
            verb_type: [RuleActionTypes.IS],
            name: toString.valueUuidToString(Values.STARTED),
            uuid: Values.STARTED,
        },

    ],
    [
        Values.ENDED,
        {
            type: 'value',
            subj_type: ['audio', 'video'],
            verb_type: [RuleActionTypes.IS],
            name: toString.valueUuidToString(Values.ENDED),
            uuid: Values.ENDED,
        },

    ],
    [
        Values.CORRECT,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.COMBINATION
            ],
            verb_type: [Operators.EQUAL],
            name: toString.valueUuidToString(Values.CORRECT),
            uuid: Values.CORRECT,
        },

    ],
    [
        Values.STATE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.SELECTOR
            ],
            verb_type: [RuleActionTypes.PROGRESS],
            name: toString.valueUuidToString(Values.STATE),
            uuid: Values.STATE,
        },

    ],
]);

export {
    RuleActionMap,
    OperatorsMap,
    ValuesMap,
}