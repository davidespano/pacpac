import RuleActionTypes from "./RuleActionTypes";
import {Operators, SuperOperators} from "./Operators";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Values from "./Values";

function eventTypeToString(eventType) {
    switch (eventType) {
        case RuleActionTypes.CLICK:
            return "clicca";
        case RuleActionTypes.CHANGE_STATE_EVENT:
            return "cambia stato a";
        case RuleActionTypes.CHANGE_VALUE_EVENT:
            return "rileva cambiamento valore da";
        case RuleActionTypes.CHANGE_COLOR_EVENT:
            return "cambia colore a";
        case RuleActionTypes.CHANGE_TEMPERATURE_EVENT:
            return "cambia temperatura a";
        case RuleActionTypes.CHANGE_VOLUME_EVENT:
            return "cambia volume a";
        case RuleActionTypes.CHANGE_STATE_SENSOR_EVENT:
            return 'rileva cambiamento stato da';
        case RuleActionTypes.CHANGE_SHUTTER:
            return "cambia percentuale apertura a";
        case RuleActionTypes.CHANGE_SHUTTER_EVENT:
            return "cambia l'apertura di";
        case RuleActionTypes.OPEN_CLOSE_DOOR_EVENT:
            return "apre o chiude";
        case RuleActionTypes.COLLECT_KEY:
            return "raccoglie";
        case RuleActionTypes.UNLOCK_LOCK:
            return "sblocca";
        case RuleActionTypes.UNLOCK_LOCK_DOOR:
            return "cambia serratura a";
        case RuleActionTypes.TRANSITION:
            return "si sposta verso";
        case RuleActionTypes.CHANGE_BACKGROUND:
            return 'cambia sfondo con';
        case RuleActionTypes.ON:
            return 'accende';
        case RuleActionTypes.OFF:
            return 'spegne';
        case RuleActionTypes.CHANGE_STATE:
            return 'cambia stato a';
        case RuleActionTypes.CHANGE_VISIBILITY:
            return 'diventa';
        case RuleActionTypes.PLAY:
            return 'riproduce';
        case RuleActionTypes.PLAY_LOOP:
            return 'riproduce in loop';
        case RuleActionTypes.STOP:
            return 'interrompe';
        case RuleActionTypes.LOOK_AT:
            return 'guarda';
        case RuleActionTypes.INCREASE:
            return "va a";
        case RuleActionTypes.INCREASE_STEP:
            return "aumenta di";
        case RuleActionTypes.DECREASE_STEP:
            return "diminuisce di";
        case RuleActionTypes.IS:
            return 'è';
        case RuleActionTypes.CHANGE_VOLUME:
            return 'cambia volume al valore';
        case RuleActionTypes.CHANGE_TEMPERATURE:
            return 'cambia temperatura a';
        case RuleActionTypes.CHANGE_COLOR:
            return 'cambia colore a';
        case RuleActionTypes.DETECTS_MOTION:
            return 'rileva movimento di';
        case RuleActionTypes.DETECTS_SMOKE:
            return 'rileva fumo';
        default:
            return "";
    }
}

function objectTypeToString(objectType) {
    let type = "";
    switch (objectType) {
        case InteractiveObjectsTypes.BUTTON:
            type = "il pulsante";
            break;
        case InteractiveObjectsTypes.COUNTER:
            type = "il contatore";
            break;
        case InteractiveObjectsTypes.CUMULABLE:
            type = "l'oggetto";
            break;
        case InteractiveObjectsTypes.LOCK:
            type = "la serratura";
            break;
        case InteractiveObjectsTypes.POINT_OF_INTEREST:
            type = "il punto";
            break;
        case InteractiveObjectsTypes.SELECTOR:
            type = "il selettore";
            break;
        case InteractiveObjectsTypes.SWITCH:
            type = "l'interruttore";
            break;
        case InteractiveObjectsTypes.TIMER:
            type = "il timer";
            break;
        case InteractiveObjectsTypes.KEY:
            type = "la chiave";
            break;
        case InteractiveObjectsTypes.TRANSITION:
            type = "la transizione";
            break;
        case InteractiveObjectsTypes.PLAYER:
            type = "il giocatore";
            break;

        // IoT Items
        case InteractiveObjectsTypes.BLIND:
          	type = "la serranda";
          	break;
        case InteractiveObjectsTypes.DOOR:
            type = "la porta";
        	break;
        case InteractiveObjectsTypes.AIR_CONDITIONER:
            type = "il condizionatore";
        	break;
        case InteractiveObjectsTypes.LIGHT:
            type = "la luce";
          	break;
        case InteractiveObjectsTypes.POWER_OUTLET:
        	type = "la presa elettrica";
        	break;
        case InteractiveObjectsTypes.DSWITCH:
        	type = "l'interruttore";
        	break;
        case InteractiveObjectsTypes.SIREN:
            type = "la sirena";
            break;
        case InteractiveObjectsTypes.MOTION_DETECTOR:
        	type = "il sensore di movimento";
        	break;
        case InteractiveObjectsTypes.SENSOR:
          	type = "il sensore";
          	break;
        case InteractiveObjectsTypes.SMOKE_DETECTOR:
        	type = "il sensore fumi";
        	break;
        case InteractiveObjectsTypes.SPEAKER:
            type = "l'altoparlante";
            break;
        case Values.THREE_DIM:
        case Values.IOT:
        case Values.TWO_DIM:
            type = "la scena";
            break;
        case "number":
        case "operation":
        case "operator":
        case "value":
            return type;
        case 'video':
            type = 'il video';
            break;
        case 'img':
            type = "l'immagine";
            break;
        case 'file':
            type = 'il file';
            break;
        case "audio":
            type = "l\'audio";
            break;
        default:
            type = "l'oggetto sconosciuto";
            break;
    }
    return type + " ";
}

function operatorUuidToString(operatorUuid) {
    switch (operatorUuid) {
        case Operators.EQUAL:
            return "è";
        case Operators.NOT_EQUAL:
            return "non è";
        case Operators.EQUAL_OPEN:
            return "è";
        case Operators.NOT_EQUAL_OPEN:
            return "non è";
        case Operators.EQUAL_LOCK:
            return "la serratura è";
        case Operators.NOT_EQUAL_LOCK:
            return "la serratura è";
        case Operators.EQUAL_NUM:
            return "=";
        case Operators.NOT_EQUAL_NUM:
            return "≠";
        case Operators.LESS_THAN:
            return "\<";
        case Operators.LESS_EQUAL:
            return "\<=";
        case Operators.GREATER_THAN:
            return "\>";
        case Operators.GREATER_EQUAL:
            return "\>=";
        case Operators.TEMP_EQUAL_NUM:
            return "ha la temperatura =";
        case Operators.TEMP_NOT_EQUAL_NUM:
            return "ha la temperatura ≠";
        case Operators.TEMP_LESS_THAN:
            return "ha la temperatura \<";
        case Operators.TEMP_LESS_EQUAL:
            return "ha la temperatura \<=";
        case Operators.TEMP_GREATER_THAN:
            return "ha la temperatura \>";
        case Operators.TEMP_GREATER_EQUAL:
            return "ha la temperatura \>=";
        case Operators.VOLUME_EQUAL_NUM:
            return "ha il volume =";
        case Operators.VOLUME_NOT_EQUAL_NUM:
            return "ha il volume ≠";
        case Operators.VOLUME_LESS_THAN:
            return "ha il volume \<";
        case Operators.VOLUME_LESS_EQUAL:
            return "ha il volume \<=";
        case Operators.VOLUME_GREATER_THAN:
            return "ha il volume \>";
        case Operators.VOLUME_GREATER_EQUAL:
            return "ha il volume \>=";
        case Operators.SHUTTER_EQUAL_NUM:
            return "ha l'apertura =";
        case Operators.SHUTTER_NOT_EQUAL_NUM:
            return "ha l'apertura ≠";
        case Operators.SHUTTER_LESS_THAN:
            return "ha l'apertura \<";
        case Operators.SHUTTER_LESS_EQUAL:
            return "ha l'apertura \<=";
        case Operators.SHUTTER_GREATER_THAN:
            return "ha l'apertura \>";
        case Operators.SHUTTER_GREATER_EQUAL:
            return "ha l'apertura \>=";
        default:
            return "";
    }
}


function superOperatorsToString(superoperatorUuid) {
    switch (superoperatorUuid) {
        case SuperOperators.AND:
            return 'e';
        case SuperOperators.OR:
            return 'o';
        default:
            return '?';
    }
}


function valueUuidToString(valueUuid){
    switch(valueUuid){
        case Values.VISIBLE:
            return 'attivabile';
        case Values.INVISIBLE:
            return 'non attivabile';
        case Values.ON:
            return 'acceso';
        case Values.OFF:
            return 'spento';
        case Values.LOCKED:
            return 'bloccato';
        case Values.UNLOCKED:
            return 'sbloccato';
        case Values.COLLECTED:
            return 'raccolta';
        case Values.NOT_COLLECTED:
            return 'non raccolta';
        case Values.THREE_DIM:
            return '3D';
        case Values.TWO_DIM:
            return '2D';
        case Values.IOT:
            return 'IoT';
        case Values.NO_DIR:
            return 'nessuna direzione';
        case Values.UP:
            return 'su';
        case Values.DOWN:
            return 'giù';
        case Values.LEFT:
            return 'sinistra';
        case Values.RIGHT:
            return 'destra';
        case Values.STARTED:
            return 'iniziato';
        case Values.ENDED:
            return 'finito';
        case Values.OPEN:
            return 'aperto';
        case Values.CLOSED:
            return 'chiuso';
        case Values.SHUTTED:
            return 'abbassata';
        case Values.LIFTED:
            return 'sollevata';
        default:
            return 'stato sconosciuto';
    }

}

export default {
    eventTypeToString: eventTypeToString,
    objectTypeToString: objectTypeToString,
    operatorUuidToString: operatorUuidToString,
    superOperatorsToString: superOperatorsToString,
    valueUuidToString: valueUuidToString,
}
