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

function generateRawFromRules(rules, props) {
    let objectMap = props.interactiveObjects;
    let blocks = [];
    console.log(rules)
    const entityMap =  {
        quando: {type: 'quando', data: 'quando'},
        soggetto: {type: 'soggetto', data: 'soggetto', mutability: 'MUTABLE'},
        evento: {type: 'evento', data: 'evento', mutability: 'MUTABLE'},
        oggettoScena: {type: 'oggettoScena', data: 'oggettoScena', mutability: 'MUTABLE'},
        se: {type: 'se', data: 'se'},
        oggetto: {type: 'oggetto', data: 'oggetto', mutability: 'MUTABLE'},
        operatore: {type: 'operatore', data: 'operatore', mutability: 'MUTABLE'},
        valore: {type: 'valore', data: 'valore', mutability: 'MUTABLE'},
        allora: {type: 'allora', data: 'allora'},
        azione: {type: 'azione', data: 'azione', mutability: 'MUTABLE'},
    };
    rules.forEach(rule => {
        let object = objectMap.get(rule.object_uuid);
        blocks.push({
                text: 'QUANDO il giocatore clicca '+object.name+', ',
                type: 'quando-block',
                entityRanges: [
                    {offset: 0, length: 7, key: 'quando'},
                    {offset: 7, length: 13, key: 'soggetto'},
                    {offset: 20, length: 7, key: 'evento'},
                    {offset: 27, length: object.name.length , key: 'oggettoScena'},
                ],
            });
        blocks.push(
            {
                text: 'SE oggetto operatore valore, ',
                type: 'se-block',
                entityRanges: [
                    {offset: 0, length: 3, key: 'se'},
                    {offset: 3, length: 8, key: 'oggetto'},
                    {offset: 11, length: 10, key: 'operatore'},
                    {offset: 21, length: 7, key: 'valore'},
                ],
            });
        blocks.push({
                text: 'ALLORA azione ' + rule.actions[0].type,
                type: 'allora-block',
                entityRanges: [
                    {offset: 0, length: 7, key: 'allora'},
                    {offset: 7, length: 7, key: 'azione'},
                ],
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
}
