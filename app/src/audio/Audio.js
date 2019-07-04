import Immutable from 'immutable';

const Audio = Immutable.Record({
    uuid: null,
    name: null,
    file: null,
    isSpatial: false,
    scene: null,
    loop: false,
    vertices: null,
});

export default Audio;