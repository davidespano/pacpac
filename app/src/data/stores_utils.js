import Orders from "./Orders";

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
 * @param type
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

export default {
    chooseComparator: chooseComparator,
    alphabetical: alphabetical,
    rev_alphabetical: rev_alphabetical,
    chronological: chronological,
    rev_chronological: rev_chronological,
}
