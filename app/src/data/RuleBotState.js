import Immutable from 'immutable';


const RuleBotState = Immutable.Record({
    elementoMancante: '',               // Stringa che contiene cosa manca per completare la regola.
    intent: '',                         // Intent che ci indica che tipo di regola stiamo creando, viene riconosciuto direttamente da Wit.ai.
    scenaIniziale: '',                  // Scena iniziale per la transizione.
    scenaFinale: '',                    // Scena finale per indicare in quale scena spostarci con la transizione.
    oggetto: '',                        // Nome dell'oggetto principale della regola.
    statoIniziale: '',                  // Utilizzata per lo stato iniziale degli switch e per lo stato della condizione per ogni oggetto.
    statoFinale: '',                    // Stato finale dello switch.
    tipoRisposta: 'regola',             // Indica se stiamo analizzando una regola normale, un'azione o una condizione.
    ultimaRegolaCreata: '',             // Contiene l'ultima regola creata, utile per aggiungere azioni o condizioni.
    numNegazioni: 0,                    // Indica quante negazioni ci sono nella frase da analizzare.
});

export default RuleBotState;