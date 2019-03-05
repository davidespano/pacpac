import Orders from "./Orders";
import ObjectsStore from "./ObjectsStore";

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

function generateRawFromRules(rules) {
    let objectMap = ObjectsStore.getState();
    let blocks = [];
    let mutability = "IMMUTABLE";
    console.log(rules);
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
                            name: 'soggetto',
                            type: 'giocatore'
                        },
                        rule_uuid: rule.uuid
                    }},
                ['evento' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'evento',
                            type: rule.event
                        },
                        rule_uuid: rule.uuid
                    }},
                ['oggettoScena' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'oggettoScena',
                            type: rule.object_uuid
                        },
                        rule_uuid: rule.uuid
                    }},
                ['oggetto' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'oggetto',
                            type: 'oggetto'
                        },
                        rule_uuid: rule.uuid
                    }},
                ['operatore' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'operatore',
                            type: rule.condition.operator
                        },
                        rule_uuid: rule.uuid
                    }},
                ['valore' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'valore',
                            type: rule.condition.state
                        },
                        rule_uuid: rule.uuid
                    }},
                ['azione' + index]: {type: 'mention', mutability: mutability, data:{
                        mention: {
                            name: 'azione',
                            type: rule.actions[0].uuid
                        },
                        rule_uuid: rule.uuid
                    }},
        }
        entityMap = {...entityMap, ...entryEntityMap};

        blocks.push({
                text: 'QUANDO giocatore clicca '+object.name.replace(" ","_")+' ',
                type: 'quando-block',
                entityRanges: [
                    {offset: 0, length: 7, key: 'quando' + index},
                    {offset: 7, length: 10, key: 'soggetto' + index},
                    {offset: 17, length: 7, key: 'evento' + index},
                    {offset: 24, length: object.name.length+1 , key: 'oggettoScena' + index},
                ],
            });
        blocks.push(
            {
                text: 'SE oggetto operatore valore ',
                type: 'se-block',
                entityRanges: [
                    {offset: 0, length: 3, key: 'se' + index},
                    {offset: 3, length: 8, key: 'oggetto' + index},
                    {offset: 11, length: 10, key: 'operatore' + index},
                    {offset: 21, length: 7, key: 'valore' + index},
                ],
            });
        blocks.push({
                text: 'ALLORA ' + rule.actions[0].type.replace(" ","_") + ' ',
                type: 'allora-block',
                entityRanges: [
                    {offset: 0, length: 7, key: 'allora' + index},
                    {offset: 8, length: rule.actions[0].type.length+1, key: 'azione' + index},
                ],
            });
    });

    console.log(JSON.stringify(blocks));
    console.log(JSON.stringify(entityMap));
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
}
