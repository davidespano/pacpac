var AFRAME = require('aframe');

AFRAME.registerComponent('create_scene', {

    init : function () {
        //Cicleremo su tutti gli oggetti della scena(?)
        var sceneEl = document.querySelector('a-scene');
        var bolla1 = document.createElement('a-sky');
        var bolla2 = document.createElement('a-sky');
        var bolla3 = document.createElement('a-sky');
        var bolla4 = document.createElement('a-sky');

        bolla1.setAttribute('src', 'http://localhost:3000/media/bolla1.jpg');
        bolla2.setAttribute('src', 'http://localhost:3000/media/bolla2.jpg');
        bolla3.setAttribute('src', 'http://localhost:3000/media/bolla3.jpg');
        bolla4.setAttribute('src', 'http://localhost:3000/media/bolla4.jpg');

        bolla2.setAttribute('visible', 'false');
        bolla3.setAttribute('visible', 'false');
        bolla4.setAttribute('visible', 'false');

        bolla2.setAttribute('opacity', '0');
        bolla3.setAttribute('opacity', '0');
        bolla4.setAttribute('opacity', '0');

        bolla1.setAttribute('scale', '-1 1 1');
        bolla2.setAttribute('scale', '-1 1 1');
        bolla3.setAttribute('scale', '-1 1 1');
        bolla4.setAttribute('scale', '-1 1 1');

        bolla1.setAttribute('radius', '10');
        bolla2.setAttribute('radius', '10');
        bolla3.setAttribute('radius', '10');
        bolla4.setAttribute('radius', '10');

        bolla1.setAttribute('id', 'bolla1');
        bolla2.setAttribute('id', 'bolla2');
        bolla3.setAttribute('id', 'bolla3');
        bolla4.setAttribute('id', 'bolla4');

        //bolla1.setAttribute('curved','theta: 30; rotation: 0 -90 0; isSelectable: true; target: bolla2');
        //bolla1.setAttribute('curved','theta: 30; rotation: 0 -60 0; isSelectable: true; target: bolla4');
        //bolla2.setAttribute('curved','theta: 30; rotation: 0 0 0; isSelectable: true; target: bolla3');
        curvedImage(bolla1, 'bolla2', '0 -90 0', '9.5', '30', true);
        curvedImage(bolla1, 'bolla4', '0 0 0', '9.5', '30', true);
        curvedImage(bolla2, 'bolla3', '0 90 0', '9.5', '30', true);


        sceneEl.appendChild(bolla1);
        sceneEl.appendChild(bolla2);
        sceneEl.appendChild(bolla3);
        sceneEl.appendChild(bolla4);

    }
});

AFRAME.registerComponent('curved', {

    schema: {
        theta: {type: 'int'},
        rotation: {type: 'string'},
        isSelectable: {type: 'bool', default: false},
        target: {type: 'string', default: ""}
    },

    init : function () {

        var event = document.createElement('a-curvedimage');
        event.setAttribute('id', 'curv'+this.data.target);
        event.setAttribute('rotation', this.data.rotation);
        event.setAttribute('radius', '9.5');
        event.setAttribute('theta-length', this.data.theta);

        if(this.data.isSelectable) {
            event.setAttribute('selectable', 'target: ' + this.data.target);
        }

        this.el.appendChild(event);
    }
});

function curvedImage(bolla, target, rot, rad, theta, sel) {
    var event = document.createElement('a-curvedimage');
    event.setAttribute('id', 'curv'+target);
    event.setAttribute('rotation', rot);
    event.setAttribute('radius', rad);
    event.setAttribute('theta-length', theta);

    if(sel) {
        event.setAttribute('selectable', 'target: ' + target);
    }

    bolla.appendChild(event);
}