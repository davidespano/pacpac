import Immutable from 'immutable';

/*const LeftbarElement = Immutable.Record({
    id: '',
    name: '',
    img: '',
})*/

function LeftbarElement(id,name,img) {

    this.id=id;
    this.name=name;
    this.img=img;
}

export default LeftbarElement;