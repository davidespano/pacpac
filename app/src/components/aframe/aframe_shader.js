const AFRAME = require('aframe');
const THREE = require('three');

AFRAME.registerShader('multi-video', {
    // The schema declares any parameters for the shader.
    schema: {
        src: {type: 'map'},
        transparent: {type: "boolean", default: true, is: 'uniform'},
        opacity: {type: "number", default: 1, is: 'uniform'},
    },

    vertexShader:
        `
        varying vec2 vUv;
        
        void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `
    ,
    fragmentShader:
        `
        precision mediump int;
        precision mediump float;
        
        varying vec2 vUv;
        uniform sampler2D video1;
        uniform sampler2D video2;
        uniform sampler2D mask;
        uniform float opacity;
        
        void main() {
        
        gl_FragColor = vec4(mix(
            texture2D(video1, vUv),
            texture2D(video2, vUv),
            texture2D(mask, vUv).y));
        gl_FragColor.a = opacity;
        
        //gl_FragColor = mix(
         //texture2D(video1, vUv),
         //texture2D(video2, vUv),
         //texture2D(mask, vUv).y);
        
        }
        `
});
