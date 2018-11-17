const AFRAME = require('aframe');
const THREE = require('three');

AFRAME.registerShader('multi-video', {
    // The schema declares any parameters for the shader.
    schema: {
        src: {type: 'map'}
    },

    uniforms : {
        video1: { type: "t", value: null},
        video2: { type: "t", value: null},
        mask: {type: "t", value: null}
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
        
        void main() {
        
        gl_FragColor = mix(
         texture2D(video1, vUv),
         texture2D(video2, vUv),
         texture2D(mask, vUv).y);
        
        //gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
        }
        `
});
