const AFRAME = require('aframe');
const THREE = require('three');

AFRAME.registerShader('multi-video', {
    // The schema declares any parameters for the shader.
    schema: {
        src: {type: 'map'},
        transparent: {type: "boolean", default: true, is: 'uniform'},
        opacity: {type: "number", default: 0.8, is: 'uniform'},
    },

    uniforms : {
        video1: { type: "t", value: null},
        video2: { type: "t", value: null},
        mask: {type: "t", value: null},
        transparent: {type: "boolean", default: true},
        opacity: {type: "float", default: 1}
    },

    init: function(data) {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });
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
