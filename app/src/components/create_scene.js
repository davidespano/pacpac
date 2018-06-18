var AFRAME = require('aframe');

AFRAME.registerComponent('create_scene', {

    init : function () {

        var sceneEl = document.querySelector('a-scene');
        var sky = document.createElement('a-sky');
        sky.setAttribute('src', 'http://localhost:3000/media/sample7.jpg');
        sky.setAttribute('scale', '-1 1 1');
        sky.setAttribute('id', 'bolla1');
        sky.setAttribute('curved','theta: 30; rotation: 0 0 0; isSelectable: true; target: bolla2');

        sceneEl.appendChild(sky);
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
        event.setAttribute('id', 'prova1');
        event.setAttribute('rotation', this.data.rotation);
        event.setAttribute('radius', '9,5');
        event.setAttribute('theta-length', this.data.theta);

        if(this.data.isSelectable) {
            console.log("(CreateScene) Target: " + this.data.target);
            event.setAttribute('selectable', 'target: ' + this.data.target);
        }

        this.el.appendChild(event);


    }
});