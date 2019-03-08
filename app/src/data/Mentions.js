import React from 'react';
import Immutable from 'immutable';
import RuleActionTypes from "../interactives/rules/RuleActionTypes";
import {Operators} from "../interactives/rules/Operators";
import EventTypes from "../interactives/rules/EventTypes";

const Mentions = Immutable.Record({
    objects: [],
    scenes: [],
    subjects: [{name:'il giocatore', link: '#', type: 'soggetto'}],
    events: [{name: 'seleziona', link: '#', type: 'evento', event: EventTypes.CLICK}],
    actions: [
        {name:'esegui transizione verso', link: '#', type: 'azione', action: RuleActionTypes.TRANSITION},
        {name:'accendi l\'interruttore', link: '#', type: 'azione', action: RuleActionTypes.ON},
        {name:'spegni l\'interruttore', link: '#', type: 'azione', action: RuleActionTypes.OFF},
        {name:'inverti l\'interruttore', link: '#', type: 'azione', action: RuleActionTypes.FLIP_SWITCH},
        {name: 'riproduci audio', link: '#', type: 'azione', action: RuleActionTypes.PLAY_AUDIO},
        {name: 'metti in pausa audio', link: '#', type: 'azione', action: RuleActionTypes.STOP_AUDIO},
        {name: 'raccogli la chiave', link: '#', type: 'azione', action: RuleActionTypes.COLLECT_KEY},
        {name: 'apri il lucchetto', link: '#', type: 'azione', action: RuleActionTypes.UNLOCK_LOCK},
        {name: 'sostituisci sfondo con', link: '#', type:'azione', action: RuleActionTypes.CHANGE_BACKGROUND},
    ],
    operators: [
        {name:'=', link: '#', type: 'operatore', operator: Operators.EQUAL},
        {name:'<', link: '#', type: 'operatore', operator: Operators.LESS_THAN},
        {name:'>', link: '#', type: 'operatore', operator: Operators.GREATER_THAN},
        {name:'<=', link: '#', type: 'operatore', operator: Operators.LESS_EQUAL},
        {name:'>=', link: '#', type: 'operatore', operator: Operators.GREATER_EQUAL},
    ],
    values: [
        {name:'sbloccato', link: '#', type: 'valore', value: 'UNLOCKED'},
        {name:'raccolto', link: '#', type: 'valore', value: 'COLLECTED'},
        {name:'acceso', link: '#', type: 'valore', value: 'ON'},
        {name:'spento', link: '#', type: 'valore', value: 'OFF'}
        ],
    objectsScene: [],

});

export default Mentions;
/*
const Mentions = [
    {
        name: 'Matthew Russell',
        link: 'https://twitter.com/mrussell247',
        avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
    },
    {
        name: 'Julian Krispel-Samsel',
        link: 'https://twitter.com/juliandoesstuff',
        avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
    },
    {
        name: 'Jyoti Puri',
        link: 'https://twitter.com/jyopur',
        avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
        name: 'Max Stoiber',
        link: 'https://twitter.com/mxstbr',
        avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
    },
    {
        name: 'Nik Graf',
        link: 'https://twitter.com/nikgraf',
        avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
        name: 'Pascal Brandt',
        link: 'https://twitter.com/psbrandt',
        avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
];


export default Mentions; */