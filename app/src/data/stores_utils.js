import Orders from "./Orders";
import ObjectsStore from "./ObjectsStore";
import Rule from "../interactives/rules/Rule";
import Immutable from "immutable";
import InteractiveObjectAPI from "../utils/InteractiveObjectAPI";
import Actions from "../actions/Actions";
import RuleActionTypes from "../interactives/rules/RuleActionTypes";
import EventTypes from "../interactives/rules/EventTypes";
import Mentions from "./Mentions";
import MentionsStore from "./MentionsStore";

/**
 * Returns correct comparator according to the given type
 * @param type
 * @returns {*}
 */
function chooseComparator(type){
    switch(type){
        case Orders.ALPHABETICAL:
            return alphabetical;
        case Orders.REV_ALPHABETICAL:
            return rev_alphabetical;
        case Orders.CHRONOLOGICAL:
            return chronological;
        case Orders.REV_CHRONOLOGICAL:
            return rev_chronological;
        default:
            return () => 0;
    }
}

/**
 * Comparator on object names
 * @param a
 * @param b
 * @returns {number}
 */
function alphabetical(a, b){
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
}

/**
 * Comparator on object names
 * @param a
 * @param b
 * @returns {number}
 */
function rev_alphabetical(a, b){
    return -(alphabetical(a, b));
}

/**
 * Comparator on object indexes
 * @param a
 * @param b
 * @returns {number}
 */
function chronological(a, b){
    if(a.index < b.index) return -1;
    if(a.index > b.index) return 1;
    return 0;
}

/**
 * Comparator on object indexes
 * @param a
 * @param b
 * @returns {number}
 */
function rev_chronological(a, b){
    return -(chronological(a, b));
}

function parseRulesFromRaw(content, scene){
    const entityMap = content.entityMap;
    let rules = new Immutable.Map();
    Object.entries(entityMap).forEach(([key, val]) => {
        if(val.data.rule_uuid){
            let mention = val.data.mention;
            let rule = rules.get(val.data.rule_uuid);

            if(!mention)
                return;

            if (!rule) {
                rule = new Rule();
                rule = rule.set("uuid", val.data.rule_uuid);
            }

            let action;

            if(val.data.action_uuid && rule.actions)
            {
                action = rule.actions.find((a) => {
                    if(a)
                        return a.uuid === val.data.action_uuid;
                    return false;
                });
            }

            if(!action && val.data.action_uuid){
                action = {uuid: val.data.action_uuid}
            }

            let condition = {};

            if(rule.condition)
                condition = rule.condition;

            switch (mention.type) {
                case "soggetto":
                    break;
                case "evento":
                    rule = rule.set("event", mention.event);
                    break;
                case "oggettoScena":
                    rule = rule.set("object_uuid", mention.uuid);
                    break;
                case "oggetto":
                    if(mention.uuid)
                        condition = {...condition, uuid: mention.uuid};
                    break;
                case "operatore":
                    if(mention.operator)
                        condition = {...condition, operator: mention.operator};
                    break;
                case "valore":
                    if(mention.value)
                        condition = {...condition, state: mention.value};
                    break;
                case "azione":
                    action = {...action, type: mention.action};
                    break;
                case "scena":
                    if(action.type === RuleActionTypes.TRANSITION)
                        action = {...action, target: mention.name};
                    else
                        action = {...action, target: '---'}
                    break;
                default:
                    break;
            }
            if(condition)
                rule = rule.set("condition", condition);
            if(action)
                rule = rule.set("actions", [action]);
            console.log(rule);
            rules = rules.set(val.data.rule_uuid,rule);
        }
    });

    rules.valueSeq().forEach((rule) =>{
        InteractiveObjectAPI.saveRule(scene,rule);
        Actions.updateRule(rule);
    });
    return rules;
}

function generateRawFromRules(rules) {
    let objectMap = ObjectsStore.getState();
    let blocks = [];
    let mutability = "IMMUTABLE";

    let entityMap = {};
    // const entityMap =  {
    //     quando: {type: 'quando', data: 'quando'},
    //     soggetto: {type: 'soggetto', data: 'soggetto', mutability: 'MUTABLE'},
    //     evento: {type: 'evento', data: 'evento', mutability: 'MUTABLE'},
    //     oggettoScena: {type: 'oggettoScena', data: 'oggettoScena', mutability: 'MUTABLE'},
    //     se: {type: 'se', data: 'se'},
    //     oggetto: {type: 'oggetto', data: 'oggetto', mutability: 'MUTABLE'},
    //     operatore: {type: 'operatore', data: 'operatore', mutability: 'MUTABLE'},
    //     valore: {type: 'valore', data: 'valore', mutability: 'MUTABLE'},
    //     allora: {type: 'allora', data: 'allora'},
    //     azione: {type: 'azione', data: 'azione', mutability: 'MUTABLE'},
    // };

    rules.forEach((rule,index) => {
        let object = objectMap.get(rule.object_uuid);

        const entryEntityMap = {
                ['quando' + index]: {type: 'quando', data: 'quando'},
                ['se' + index]: {type: 'se', data: 'se'},
                ['allora' + index]: {type: 'allora', data: 'allora'},
                ['soggetto' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'il giocatore',
                            type: 'soggetto',
                            link: "#"
                        },
                        rule_uuid: rule.uuid,
                    }},
                ['evento' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: Mentions().events.find((mention) =>{
                            return mention.event === rule.event;
                        }),
                        rule_uuid: rule.uuid,
                    }},
                ['oggettoScena' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: object ? object.name : 'oggetto',
                            type: 'oggettoScena',
                            link: "#",
                            uuid: rule.object_uuid
                        },
                        rule_uuid: rule.uuid,
                    }},
                ['oggetto' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: Object.keys(rule.condition).length > 0 && rule.condition.uuid && ObjectsStore.getState().get(rule.condition.uuid) ? ObjectsStore.getState().get(rule.condition.uuid).name : 'oggetto',
                            type: 'oggetto',
                            link: "#",
                            uuid: Object.keys(rule.condition).length > 0 && rule.condition.uuid && ObjectsStore.getState().get(rule.condition.uuid) ? rule.condition.uuid : null
                        },
                        rule_uuid: rule.uuid,
                    }},
                ['operatore' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: Object.keys(rule.condition).length > 0 && rule.condition.operator ? Mentions().operators.find((mention) =>{
                            return mention.operator === rule.condition.operator;
                        }) : {name: 'operatore', type: 'operatore', link:'#'},
                        rule_uuid: rule.uuid,
                    }},
                ['valore' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: Object.keys(rule.condition).length > 0 && rule.condition.state ? Mentions().values.find((mention) =>{
                            return mention.value === rule.condition.state;
                        }): {name: 'valore', type: 'valore', link:'#'},
                        rule_uuid: rule.uuid,
                    }},
                ['azione' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: Mentions().actions.find((mention) =>{
                            return mention.action === rule.actions[0].type;
                        }),
                        rule_uuid: rule.uuid,
                        action_uuid: rule.actions[0].uuid,
                    }},
                ['scena' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: rule.actions[0].type === RuleActionTypes.TRANSITION ? (rule.actions[0].target||'scena') : 'scena',
                            type: 'scena',
                            link: "#"
                        },
                        rule_uuid: rule.uuid,
                        action_uuid: rule.actions[0].uuid,
                    }},
                ['buttonRemove' + index]: {type: 'buttonRemove', mutability: mutability, data: {
                        text:'Rimuovi',
                        rule_uuid: rule.uuid,
                    }},
                ['buttonAddCondition' + index]: {type: 'buttonAddCondition', mutability: mutability, data: {
                        text:'Aggiungi condizione',
                        rule_uuid: rule.uuid,
                    }},
                ['buttonRemoveCondition' + index]: {type: 'buttonRemoveCondition', mutability: mutability, data: {
                        text:'Rimuovi condizione',
                        rule_uuid: rule.uuid,
                    }},
        };
        entityMap = {...entityMap, ...entryEntityMap};

        let soggetto = {offset: 7, length: entityMap['soggetto'+index].data.mention.name.length +1, key: 'soggetto' + index};
        let evento = {offset: soggetto.offset+soggetto.length, length: entityMap['evento'+index].data.mention.name.length +1, key: 'evento' + index};
        let oggettoScena = {offset: evento.offset+evento.length, length: entityMap['oggettoScena'+index].data.mention.name.length +1, key: 'oggettoScena' + index};

        blocks.push({
                text: 'QUANDO '+entityMap['soggetto'+index].data.mention.name +' '+entityMap['evento'+index].data.mention.name+' '+entityMap['oggettoScena'+index].data.mention.name+' ',
                type: 'quando-block',
                entityRanges: [
                    {offset: 0, length: 7, key: 'quando' + index},
                    soggetto,
                    evento,
                    oggettoScena,
                ],
            });

        let oggetto = {offset: 3, length: entityMap['oggetto'+index].data.mention.name.length +1, key: 'oggetto' + index};
        let operatore = {offset: oggetto.offset+oggetto.length, length: entityMap['operatore'+index].data.mention.name.length +1, key: 'operatore' + index};
        let valore = {offset: operatore.offset+operatore.length, length: entityMap['valore'+index].data.mention.name.length +1, key: 'valore' + index}
        blocks.push(
            {
                text: 'SE '+entityMap['oggetto'+index].data.mention.name +' '+entityMap['operatore'+index].data.mention.name+' '+entityMap['valore'+index].data.mention.name+' ',
                type: 'se-block',
                entityRanges: [
                    {offset: 0, length: 3, key: 'se' + index},
                    oggetto,
                    operatore,
                    valore
                ],
            });


        let alloraText = 'ALLORA ' + entityMap['azione'+index].data.mention.name + ' '
        let azione = {offset: 7, length: entityMap['azione'+index].data.mention.name.length+1, key: 'azione' + index};
        let alloraRanges = [
            {offset: 0, length: 7, key: 'allora' + index},
            azione
        ];
        if(rule.actions[0].type === RuleActionTypes.TRANSITION ){
            alloraText += entityMap['scena'+index].data.mention.name +' ';

            let scena = {offset: azione.offset+azione.length, length: entityMap['scena'+index].data.mention.name.length+1, key: 'scena' + index};
            alloraRanges = [...alloraRanges, scena];
        }

        blocks.push({
                text: alloraText,
                type: 'allora-block',
                entityRanges: alloraRanges,
            });
        blocks.push({
            text: "remove addCond remCond",
            type: 'buttons-block',
            entityRanges:[
                {offset: 0, length: 6, key: 'buttonRemove' + index},
                {offset: 6, length: 7, key: 'buttonAddCondition' + index},
                {offset: 15, length: 7, key: 'buttonRemoveCondition' + index}
            ]
        });
        blocks.push({
            text: "",
            type: 'empty-block'
        });
    });

    return {
        blocks: blocks,
        entityMap: entityMap
    }
}



export default {
    chooseComparator: chooseComparator,
    alphabetical: alphabetical,
    rev_alphabetical: rev_alphabetical,
    chronological: chronological,
    rev_chronological: rev_chronological,
    generateRawFromRules: generateRawFromRules,
    parseRulesFromRaw: parseRulesFromRaw,
}
