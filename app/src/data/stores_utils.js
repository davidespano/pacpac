/**
 * Comparator on object name (crescent order)
 * @param type
 * @returns {number}
 */
function crescent_comparator(a, b){
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
}

export default {
    crescent_comparator: crescent_comparator,
}
