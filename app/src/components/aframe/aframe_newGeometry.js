/**
 * Componente A-frame per creare una geometria custom, prende i vertici in ingresso e crea una tringolazione e quindi una
 * shape a partire da essi
 */
import './aframe_pointSaver'

const AFRAME = require('aframe');
const THREE = require('three');

AFRAME.registerGeometry('polyline', {
    schema: {
        vertices: {type: 'array'}
        },

    init: function (data) {
        let geometry = new THREE.Geometry(); //Creo una nuova goemtria THREE.js

        //Scorro tutti i vertici e li inserisco dentro la nuova geometria
        geometry.vertices = data.vertices.map(function (vertex) {
            let points = vertex.split(' ').map(function(x){return parseFloat(x);});
            return new THREE.Vector3(points[0], points[1], points[2]);
        });

        //Genero il boundingBox
        geometry.computeBoundingBox();

        //Triangolo la geometria
        let facess = THREE.ShapeUtils.triangulateShape(geometry.vertices, []);
        for( var i = 0; i < facess.length; i++){
            geometry.faces.push(new THREE.Face3( facess[i][0], facess[i][1], facess[i][2]));
        }

        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.material = THREE.DoubleSide;

        this.geometry = geometry;
    }
});

