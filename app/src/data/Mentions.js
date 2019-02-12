import React from 'react';
import Immutable from 'immutable';

const Mentions = Immutable.Record({
    objects: Immutable.Map(),
    scenes: Immutable.Map(),
});

export default Mentions;