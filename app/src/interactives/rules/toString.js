import RuleActionTypes from "./RuleActionTypes";
import {Operators, SuperOperators} from "./Operators";
import InteractiveObjectsTypes from "../InteractiveObjectsTypes";
import Values from "./Values";

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
            return 'diventa';
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
        case Values.THREE_DIM:
        case Values.TWO_DIM:
            type = "la scena";
            break;
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
        case Operators.LESS_THAN:
            return "è minore di";
        case Operators.LESS_EQUAL:
            return "è minore o uguale di";
        case Operators.GREATER_THAN:
            return "è maggiore di";
        case Operators.GREATER_EQUAL:
            return "è maggiore o uguale di";
        default:
            return "operatore sconosciuto";
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
            return 'invisibile';
        case Values.ON:
            return 'acceso';
        case Values.OFF:
            return 'spento';
        case Values.LOCKED:
            return 'chiuso';
        case Values.UNLOCKED:
            return 'aperto';
        case Values.COLLECTED:
            return 'raccolto';
        case Values.NOT_COLLECTED:
            return 'non raccolto';
        case Values.THREE_DIM:
            return '3D';
        case Values.TWO_DIM:
            return '2D';
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