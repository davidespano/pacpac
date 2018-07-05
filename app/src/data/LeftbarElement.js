import Immutable from 'immutable';

const LeftbarElement = Immutable.Record({
    name: '',
    img: '',
    label: {
        title: '---',
        color: 'black',
    },
});

export default LeftbarElement;