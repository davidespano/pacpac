import Immutable from 'immutable';

const Audio = Immutable.Record({
    uuid: null,
    name: null,
    files: null,
    isLocal: false,
    isMultichannel: false,
    scene: null,
    loop: false,
});

export default Audio;