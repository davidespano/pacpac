import Immutable from "immutable";

/**
 * @type {*|Immutable.Record.Class}
 * @param name default empty string
 * @param img default empty string
 * @param index default zero
 * @param type default 3D
 * @param tag default object containing tagName (default ---) and tagColor (default black)
 * @param objects default object containing empty arrays for each InteractiveObject type
 * @param rules default empty array
 */
const Scene = Immutable.Record({

    name : "",
    img : "",
    index : 0,
    type : "3D",
    tag : {
        tagName : '---',
        tagColor : 'black',
    },
    objects : {
        transitions: [], // uuid list
    },
    rules : [], // uuid list

});

export default Scene;