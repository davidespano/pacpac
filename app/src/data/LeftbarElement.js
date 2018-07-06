import Immutable from 'immutable';

const LeftbarElement = Immutable.Record({
    name: '',
    img: '',
    tag: {
        tagName: '---',
        tagColor: 'black',
    },
});

export default LeftbarElement;