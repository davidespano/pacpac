var AFRAME = require('aframe');
var THREE = require('three');


AFRAME.registerGeometry('mygeo', {
    schema: {
        vertices: {type: 'array'}
        },

    init: function (data) {
        var geometry = new THREE.Geometry();
        //geometry.vertices = data.vertices;
        console.log("vertici");
        console.log(data.vertices);
        geometry.vertices = data.vertices.map(function (vertex) {
            var points = vertex.split(' ').map(function(x){return parseFloat(x);});
            return new THREE.Vector3(points[0], points[1], points[2]);
        });
        console.log(geometry.vertices);

        //console.log(geometry.vertices);

        geometry.computeBoundingBox();
        let facess = THREE.ShapeUtils.triangulateShape(geometry.vertices, []);
        for( var i = 0; i < facess.length; i++){
            geometry.faces.push( new THREE.Face3( facess[i][0], facess[i][1], facess[i][2]));
        }
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        this.geometry = geometry;
    }
});