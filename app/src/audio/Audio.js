import Immutable from 'immutable';

const Audio = Immutable.Record({
    uuid: null,
    name: null,
    file: null,
    isLocal: false,
    scene: null,
    loop: false,
});

export default Audio;