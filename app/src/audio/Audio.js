import Immutable from 'immutable';

const Audio = Immutable.Record({
    uuid: null,
    name: null,
    file: null,
    volume: 50,
    isSpatial: false,
    scene: null,
    loop: false,
    vertices: null,
    type: 'audio',
});

export default Audio;