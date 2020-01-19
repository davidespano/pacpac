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
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CLICK),
            uuid: RuleActionTypes.CLICK
        },
    ],
    [
        RuleActionTypes.DETECTS_MOTION,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.MOTION_DETECTOR],
            obj_type: [InteractiveObjectsTypes.PLAYER],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.DETECTS_MOTION),
            uuid: RuleActionTypes.DETECTS_MOTION
        },
    ],
    [
        RuleActionTypes.DETECTS_SMOKE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.SMOKE_DETECTOR],
            obj_type: [],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.DETECTS_SMOKE),
            uuid: RuleActionTypes.DETECTS_SMOKE
        },
    ],
    [
        RuleActionTypes.OPEN_CLOSE_DOOR_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.DOOR],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.OPEN_CLOSE_DOOR_EVENT),
            uuid: RuleActionTypes.OPEN_CLOSE_DOOR_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_SHUTTER_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [InteractiveObjectsTypes.BLIND],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_SHUTTER_EVENT),
            uuid: RuleActionTypes.CHANGE_SHUTTER_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_VALUE_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.SENSOR],
            obj_type: [
                InteractiveObjectsTypes.PLAYER,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_VALUE_EVENT),
            uuid: RuleActionTypes.CHANGE_VALUE_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_STATE_SENSOR_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.SENSOR],
            obj_type: [
                InteractiveObjectsTypes.PLAYER,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_STATE_SENSOR_EVENT),
            uuid: RuleActionTypes.CHANGE_STATE_SENSOR_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_STATE_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.DSWITCH,
                InteractiveObjectsTypes.SIREN,
                InteractiveObjectsTypes.SPEAKER,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_STATE_EVENT),
            uuid: RuleActionTypes.CHANGE_STATE_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_COLOR_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.LIGHT,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_COLOR_EVENT),
            uuid: RuleActionTypes.CHANGE_COLOR_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_TEMPERATURE_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_TEMPERATURE_EVENT),
            uuid: RuleActionTypes.CHANGE_TEMPERATURE_EVENT
        },
    ],
    [
        RuleActionTypes.CHANGE_VOLUME_EVENT,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.PLAYER],
            obj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            event: true,
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_VOLUME_EVENT),
            uuid: RuleActionTypes.CHANGE_VOLUME_EVENT
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
            subj_type: [Values.THREE_DIM, Values.TWO_DIM, Values.IOT],
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
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.SIREN,
                InteractiveObjectsTypes.SPEAKER
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
            subj_type: [InteractiveObjectsTypes.COUNTER],
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
        RuleActionTypes.CHANGE_TEMPERATURE,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.AIR_CONDITIONER],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_TEMPERATURE),
            uuid: RuleActionTypes.CHANGE_TEMPERATURE,
        },
    ],
    [
        RuleActionTypes.CHANGE_COLOR,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.LIGHT],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_COLOR),
            uuid: RuleActionTypes.CHANGE_COLOR,
        },
    ],
    [
        RuleActionTypes.CHANGE_VOLUME,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.SPEAKER, InteractiveObjectsTypes.SIREN],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_VOLUME),
            uuid: RuleActionTypes.CHANGE_VOLUME,
        },
    ],
    [
        RuleActionTypes.CHANGE_SHUTTER,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.BLIND],
            obj_type: ['number'],
            name: toString.eventTypeToString(RuleActionTypes.CHANGE_SHUTTER),
            uuid: RuleActionTypes.CHANGE_SHUTTER,
        },
    ],
    [
        RuleActionTypes.UNLOCK_LOCK_DOOR,
        {
            type: "operation",
            subj_type: [InteractiveObjectsTypes.DOOR],
            obj_type: ['value'],
            name: toString.eventTypeToString(RuleActionTypes.UNLOCK_LOCK_DOOR),
            uuid: RuleActionTypes.UNLOCK_LOCK_DOOR
        }
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
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.MOTION_DETECTOR,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.DSWITCH,
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
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.MOTION_DETECTOR,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.DSWITCH,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL),
            uuid: Operators.NOT_EQUAL,
        },
    ],
    [
        Operators.EQUAL_OPEN,
        {
            subj_type: [
                InteractiveObjectsTypes.DOOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL_OPEN),
            uuid: Operators.EQUAL_OPEN,
        },
    ],
    [
        Operators.NOT_EQUAL_OPEN,
        {
            subj_type: [
                InteractiveObjectsTypes.DOOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL_OPEN),
            uuid: Operators.NOT_EQUAL_OPEN,
        },
    ],
    [
        Operators.EQUAL_LOCK,
        {
            subj_type: [
                InteractiveObjectsTypes.DOOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL_LOCK),
            uuid: Operators.EQUAL_LOCK,
        },
    ],
    [
        Operators.NOT_EQUAL_LOCK,
        {
            subj_type: [
                InteractiveObjectsTypes.DOOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL_LOCK),
            uuid: Operators.NOT_EQUAL_LOCK,
        },
    ],
    [
        Operators.EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.EQUAL_NUM),
            uuid: Operators.EQUAL_NUM,
        },
    ],
    [
        Operators.NOT_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.NOT_EQUAL_NUM),
            uuid: Operators.NOT_EQUAL_NUM,
        },
    ],
    [
        Operators.LESS_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_EQUAL),
            uuid: Operators.LESS_EQUAL,
        },
    ],
    [
        Operators.LESS_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.LESS_THAN),
            uuid: Operators.LESS_THAN,
        },
    ],
    [
        Operators.GREATER_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_EQUAL),
            uuid: Operators.GREATER_EQUAL,
        },
    ],
    [
        Operators.GREATER_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.COUNTER,
                InteractiveObjectsTypes.SENSOR,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.GREATER_THAN),
            uuid: Operators.GREATER_THAN,
        },
    ],
    [
        Operators.TEMP_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_EQUAL_NUM),
            uuid: Operators.TEMP_EQUAL_NUM,
        },
    ],
    [
        Operators.TEMP_NOT_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_NOT_EQUAL_NUM),
            uuid: Operators.TEMP_NOT_EQUAL_NUM,
        },
    ],
    [
        Operators.TEMP_LESS_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_LESS_EQUAL),
            uuid: Operators.TEMP_LESS_EQUAL,
        },
    ],
    [
        Operators.TEMP_LESS_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_LESS_THAN),
            uuid: Operators.TEMP_LESS_THAN,
        },
    ],
    [
        Operators.TEMP_GREATER_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_GREATER_EQUAL),
            uuid: Operators.TEMP_GREATER_EQUAL,
        },
    ],
    [
        Operators.TEMP_GREATER_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.AIR_CONDITIONER,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.TEMP_GREATER_THAN),
            uuid: Operators.TEMP_GREATER_THAN,
        },
    ],
    [
        Operators.VOLUME_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_EQUAL_NUM),
            uuid: Operators.VOLUME_EQUAL_NUM,
        },
    ],
    [
        Operators.VOLUME_NOT_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_NOT_EQUAL_NUM),
            uuid: Operators.VOLUME_NOT_EQUAL_NUM,
        },
    ],
    [
        Operators.VOLUME_LESS_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_LESS_EQUAL),
            uuid: Operators.VOLUME_LESS_EQUAL,
        },
    ],
    [
        Operators.VOLUME_LESS_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_LESS_THAN),
            uuid: Operators.VOLUME_LESS_THAN,
        },
    ],
    [
        Operators.VOLUME_GREATER_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_GREATER_EQUAL),
            uuid: Operators.VOLUME_GREATER_EQUAL,
        },
    ],
    [
        Operators.VOLUME_GREATER_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.VOLUME_GREATER_THAN),
            uuid: Operators.VOLUME_GREATER_THAN,
        },
    ],
    [
        Operators.SHUTTER_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_EQUAL_NUM),
            uuid: Operators.SHUTTER_EQUAL_NUM,
        },
    ],
    [
        Operators.SHUTTER_NOT_EQUAL_NUM,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_NOT_EQUAL_NUM),
            uuid: Operators.SHUTTER_NOT_EQUAL_NUM,
        },
    ],
    [
        Operators.SHUTTER_LESS_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_LESS_EQUAL),
            uuid: Operators.SHUTTER_LESS_EQUAL,
        },
    ],
    [
        Operators.SHUTTER_LESS_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_LESS_THAN),
            uuid: Operators.SHUTTER_LESS_THAN,
        },
    ],
    [
        Operators.SHUTTER_GREATER_EQUAL,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_GREATER_EQUAL),
            uuid: Operators.SHUTTER_GREATER_EQUAL,
        },
    ],
    [
        Operators.SHUTTER_GREATER_THAN,
        {
            subj_type: [
                InteractiveObjectsTypes.BLIND
            ],
            type: "operator",
            name: toString.operatorUuidToString(Operators.SHUTTER_GREATER_THAN),
            uuid: Operators.SHUTTER_GREATER_THAN,
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
                InteractiveObjectsTypes.KEY,
                InteractiveObjectsTypes.COUNTER,
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
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.DSWITCH,
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.MOTION_DETECTOR,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            verb_type: [
                RuleActionTypes.CHANGE_STATE,
                RuleActionTypes.IS,
            ],
            name: toString.valueUuidToString(Values.ON),
            uuid: Values.ON,
        },

    ],
    [
        Values.OFF,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.SWITCH,
                InteractiveObjectsTypes.DSWITCH,
                InteractiveObjectsTypes.AIR_CONDITIONER,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.LIGHT,
                InteractiveObjectsTypes.MOTION_DETECTOR,
                InteractiveObjectsTypes.POWER_OUTLET,
                InteractiveObjectsTypes.SPEAKER,
                InteractiveObjectsTypes.SIREN,
            ],
            verb_type: [
                RuleActionTypes.IS,
            ],
            name: toString.valueUuidToString(Values.OFF),
            uuid: Values.OFF,
        },

    ],
    [
        Values.LOCKED,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.DOOR
            ],
            verb_type: [RuleActionTypes.CHANGE_STATE],
            name: toString.valueUuidToString(Values.LOCKED),
            uuid: Values.LOCKED,
        },

    ],
    [
        Values.UNLOCKED,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.LOCK,
                InteractiveObjectsTypes.DOOR
            ],
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
        Values.OPEN,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.DOOR
            ],
            verb_type: [
                RuleActionTypes.IS,
            ],
            name: toString.valueUuidToString(Values.OPEN),
            uuid: Values.OPEN,
        },
    ],
    [
        Values.CLOSED,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.DOOR
            ],
            verb_type: [

                RuleActionTypes.IS,
            ],
            name: toString.valueUuidToString(Values.CLOSED),
            uuid: Values.CLOSED,
        },

    ],
    [
        Values.VALUE,
        {
            type: 'value',
            subj_type: [
                InteractiveObjectsTypes.SENSOR,
            ],
            verb_type: [RuleActionTypes.IS],
            name: toString.valueUuidToString(Values.VALUE),
            uuid: Values.VALUE,
        },

    ],
]);

export {
    RuleActionMap,
    OperatorsMap,
    ValuesMap,
}
