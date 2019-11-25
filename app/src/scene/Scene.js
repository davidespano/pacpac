import Immutable from "immutable";
import Values from "../rules/Values";

/**
 * @type {*|Immutable.Record.Class}
 * @param name default empty string
 * @param img default empty string
 * @param index default zero
 * @param type default 3D
 * @param tag default object containing tagName (default ---) and tagColor (default black)
 * @param objects default object containing empty arrays for each InteractiveObject type
 * @param rules default empty array
 * @param audios default empty arrat
 * @param music containing audio uuid for background music
 */

/*[Vittoria] attenzione che in questo oggetto immutable ci sono degli array, quindi ogni volta che genero un'istanza di questo
oggetto dovrò sempre creare per ogni attributo con un array un array vuoto, altrimenti si riferisce sempre a quella del padre
es. let s1= Scene({name='s1'}); let s2= Scene({name='s1'});
modificando l'attributo rules (che è un array) di s1 la stessa modifica verrà propagata a rules di s2 perchè l'indirizzo di memoria è lo stesso
Un esempio si può trovare in ScenesStore dove quando creo newScene metto tutti gli array vuoti
*/
const Scene = Immutable.Record({

    uuid: null,
    name : "",
    img : "",
    index : 0,
    isAudioOn : false,
    isVideoInALoop: true,
    type : Values.THREE_DIM,
    tag : 'default',
    music : null,
    sfx: null,
    objects : {
        // uuid lists
        transitions: [],
        switches: [],
        collectable_keys: [],
        locks: [],
        points: [],
        counters: [],
    },
    rules : [], // uuid list
    audios : [], // uuid list
});

export default Scene;