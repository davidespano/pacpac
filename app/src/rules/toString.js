import RuleActionTypes from "./RuleActionTypes";
import {Operators, SuperOperators} from "./Operators";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes";
import Values from "./Values";
import Rule from "./Rule";
import InteractiveObject from "../interactives/InteractiveObject";

function eventTypeToString(eventType) {
    switch (eventType) {
        case RuleActionTypes.CLICK:
            return "clicca";
        case RuleActionTypes.COLLECT_KEY:
            return "raccoglie";
        case RuleActionTypes.UNLOCK_LOCK:
            return "sblocca";
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
            return 'cambia visibilità a';
        case RuleActionTypes.CHANGE_ACTIVABILITY:
            return 'cambia attivabilità a';
        case RuleActionTypes.PLAY:
            return 'riproduce';
        case RuleActionTypes.PLAY_LOOP:
            return 'riproduce in loop';
        case RuleActionTypes.STOP:
            return 'interrompe';
        case RuleActionTypes.STOP_TIMER:
            return 'interrompe';
        case RuleActionTypes.LOOK_AT:
            return 'guarda';
        case RuleActionTypes.INCREASE:
            return "va a";
        case RuleActionTypes.INCREASE_STEP:
        case RuleActionTypes.INCREASE_NUMBER:
            return "aumenta di";
        case RuleActionTypes.DECREASE_STEP:
        case RuleActionTypes.DECREASE_NUMBER:
            return "diminuisce di";
        case RuleActionTypes.IS:
            return 'è';
        case RuleActionTypes.TRIGGERS:
            return 'avvia';
        case RuleActionTypes.ENTER_SCENE:
            return 'entra nella ';
        case RuleActionTypes.REACH_TIMER:
            return 'arriva a';
        default:
            return "";
    }
}

function objectTypeToString(objectType) {
    let type = "";
   // console.log("objectType", objectType)
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
        case InteractiveObjectsTypes.GAME:
            type = 'il gioco';
            break;
        case InteractiveObjectsTypes.HEALTH:
            type = 'la vita';
            break;
        case InteractiveObjectsTypes.SCORE:
            type = 'il punteggio';
            break;
        case InteractiveObjectsTypes.PLAYTIME:
            type = 'il tempo di gioco';
            break;
        case Values.THREE_DIM:
        case Values.TWO_DIM:
            type = "la scena";
            break;
        case Values.ZERO:
            type = "zero";
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
        case "rule":
            type = "la regola";
            break;
        default:
            type = "l\'oggetto sconosciuto";
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
            return 'visibile';
        case Values.INVISIBLE:
            return 'non visibile';
        case Values.ACTIVABLE:
            return 'attivabile';
        case Values.NOT_ACTIVABLE:
            return 'non attivabile';
        case Values.ON:
            return 'acceso';
        case Values.OFF:
            return 'spento';
        case Values.LOCKED:
            return 'chiuso';
        case Values.UNLOCKED:
            return 'aperto';
        case Values.COLLECTED:
            return 'raccolta';
        case Values.NOT_COLLECTED:
            return 'non raccolta';
        case Values.THREE_DIM:
            return '3D';
        case Values.TWO_DIM:
            return '2D';
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
        case Values.TEXTRIGHT:
            return 'destra';
        case Values.TEXTCENTER:
            return 'centro';
        case Values.TEXTLEFT:
            return 'sinistra';
        case Values.ZERO:
            return "zero";
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