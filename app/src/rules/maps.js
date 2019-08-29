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
            obj_type: ['video'],
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
            ],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_VISIBILITY),
            uuid: RuleActionTypes.CHANGE_VISIBILITY,
        },
    ],
    [
        RuleActionTypes.PLAY,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio', 'video'],
            name: toString.eventTypeToString(RuleActionTypes.PLAY),
            uuid: RuleActionTypes.PLAY,
        },
    ],
    [
        RuleActionTypes.PLAY_LOOP,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio', 'video'],
            name: toString.eventTypeToString(RuleActionTypes.PLAY_LOOP),
            uuid: RuleActionTypes.PLAY_LOOP,
        },
    ],
    [
        RuleActionTypes.STOP,
        {
            type: "operation",
            subj_type: [Values.THREE_DIM, Values.TWO_DIM],
            obj_type: ['audio', 'video'],
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
        RuleActionTypes.INCREASE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.COUNTER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.INCREASE),
            uuid: RuleActionTypes.INCREASE
        },
    ],
    [
        RuleActionTypes.DECREASE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.COUNTER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.DECREASE),
            uuid: RuleActionTypes.DECREASE
        },
    ],
]);


const OperatorsMap = Immutable.Map([
    [
        Operators.EQUAL,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL),
            uuid: Operators.EQUAL,
        },
    ],
    [
        Operators.NOT_EQUAL,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL),
            uuid: Operators.NOT_EQUAL,
        },
    ],
    /*
    [
        Operators.LESS_EQUAL,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_EQUAL),
            uuid: Operators.LESS_EQUAL,
        },
    ],
    [
        Operators.LESS_THAN,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_THAN),
            uuid: Operators.LESS_THAN,
        },
    ],
    [
        Operators.GREATER_EQUAL,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_EQUAL),
            uuid: Operators.GREATER_EQUAL,
        },
    ],
    [
        Operators.GREATER_THAN,
        {
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_THAN),
            uuid: Operators.GREATER_THAN,
        },
    ],
    */

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
                InteractiveObjectsTypes.KEY
            ],
            verb_type: [RuleActionTypes.CHANGE_VISIBILITY],
            name: toString.valueUuidToString(Values.VISIBLE),
            uuid: Values.VISIBLE,
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
                InteractiveObjectsTypes.KEY],
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
]);

export {
    RuleActionMap,
    OperatorsMap,
    ValuesMap,
}