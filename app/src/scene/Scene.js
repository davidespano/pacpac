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
const Scene = Immutable.Record({

    uuid: null,
    name : "",
    img : "",
    index : 0,
    isAudioOn : false,
    isVideoInALoop: true,
    type : Values.THREE_DIM,
    updateFreq: 1000,
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
        // IoT devices
        blinds: [],
        doors: [],
        acs: [],
        lights: [],
        motiondects: [],
        powoutlets: [],
        dswitches: [],
        sensors: [],
        sirens: [],
        smokedects: [],
        speakers: [],
    },
    rules : [], // uuid list
    audios : [], // uuid list
});

export default Scene;
