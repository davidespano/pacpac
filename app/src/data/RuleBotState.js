import Immutable from 'immutable';


const RuleBotState = Immutable.Record({
    elementoMancante: '',
    intent: '',
    scenaIniziale: '',
    scenaFinale: '',
    oggetto: '',
    statoIniziale: '',
    statoFinale: '',
    tipo: 'regola',
    ultimaRegolaCreata: '',
    numNegazioni: 0
});

export default RuleBotState;