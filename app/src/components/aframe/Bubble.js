import React from "react";
import {Entity} from 'aframe-react';
import {Curved, Sound} from './aframe_entities';
import settings from "../../utils/settings";
const THREE = require('three');
const {mediaURL} = settings;


export default class Bubble extends React.Component
{
    componentDidMount()
    {
        let el = this;
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear")
            {
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'visible: true');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');
                el.props.handler(el.props.scene.name);
            }
            this.components[evt.detail.name].animation.reset();
        });
        this.setShader();
    }

    componentDidUpdate(){
        if(!this.props.isActive) {
            Object.values(this.props.scene.objects).flat().forEach(obj => {
                Object.values(obj.media).forEach(media=>{
                    if(media !== null)
                        document.getElementById("media_" + obj.uuid).currentTime = 0;
                });
                document.getElementById("media_" + obj.uuid).currentTime = 0;
            })
        }
    }

    render() {
        //generate the interactive areas
        let scene = this.props.scene;
        const curves = Object.values(scene.objects).flat().map(curve => {
            return(
                <Curved key={"keyC"+ curve.uuid} object_uuid={this.props.isActive?curve.uuid:""} vertices={curve.vertices}/>
            );
        });
        //const sound = <Sound track={this.props.track} id = {this.props.name}/>;
        let material = "depthTest: true; ";
        let active = 'active: false;';
        let radius = 9.9;
        if (this.props.isActive) {
            material += "opacity: 1; visible: true;";
            active = 'active: true; video: ' + scene.img;
            radius = 10;
        }
        else material += "opacity: 0; visible: false";
        return(
            <Entity _ref={elem => this.nv = elem} primitive="a-videosphere" visible={this.props.isActive}
                    id={this.props.scene.name} src={'#' + this.props.scene.img} radius={radius}
                    material={material} play_video={active}>
                {curves}
            </Entity>
        );
    }

    setShader(){
        setTimeout(() => { //timeout to wait the render of the bubble
            let scene = this.props.scene;
            const objs = Object.values(scene.objects).flat(); //all the objects, whatever type
            if (objs.length === 0) return; //shader not necessary
            let sky = document.getElementById(scene.name);
            if(sky.getAttribute('material').shader === 'multi-video') {
                if (this.props.isActive) document.getElementById(scene.img).play();
                return;
            }
            let video = [];
            let masks = [];
            let aux = new THREE.VideoTexture(document.getElementById(scene.img)); //background video
            aux.minFilter = THREE.NearestFilter;
            video.push(aux);
            let dict = ['0'];
            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                let asset = document.getElementById("media_" + obj.uuid);
                if (asset === null) return;
                aux = new THREE.VideoTexture(asset);
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);
                aux = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.mask);
                aux.minFilter = THREE.NearestFilter;
                masks.push(aux);
                dict.push(obj.uuid.replace(/-/g,'_'));
            });

            if (masks.length === 0) return; //shader not necessary

            //set the shader
            sky.setAttribute('material', "shader:multi-video;");
            let children = sky.object3D.children;
            let skyMesh = null;
            children.forEach(obj => {
                if (obj.type === "Mesh")
                    skyMesh = obj;
            });

            if (skyMesh == null) return;

            let i = 0;
            let declarations = "";
            for (i = 0; i < masks.length; i++) {
                //for each of the mask and video add the variables in the uniforms field, and prepare a string for the fragment shader
                skyMesh.material.uniforms[`video${dict[i]}`] = {type: "t", value: video[i]};
                skyMesh.material.uniforms[`mask${dict[i + 1]}`] = {type: "t", value: masks[i]};
                declarations += `
                           uniform sampler2D video${dict[i]};    uniform sampler2D mask${dict[i + 1]};`;

            }
            //the last video is not handled by the previous loop
            skyMesh.material.uniforms[`video${dict[i]}`] = {type: "t", value: video[i]};
            declarations += `   uniform sampler2D video${dict[i]};`;

            //now prepare the mixfunction for the fragment shader
            let mixFunction = `mix(texture2D(video0,vUv),texture2D(video${dict[1]}, vUv),texture2D(mask${dict[1]}, vUv).y)`;
            for (i = 2; i < video.length; i++) {
                mixFunction = `mix(${mixFunction},texture2D(video${dict[i]}, vUv),texture2D(mask${dict[i]}, vUv).y)`
            }
            mixFunction = `vec4(${mixFunction});`;

            //now set the fragment shader and other small things
            let fragShader =
                `
                    precision mediump int;
                    precision mediump float;
                    
                    varying vec2 vUv;
                    ${declarations}
                    uniform float opacity;
                    
                    void main() {
                    
                    gl_FragColor = ${mixFunction}
                    gl_FragColor.a = opacity;
                    
                    }
            `;
            skyMesh.material.fragmentShader = fragShader;
            skyMesh.material.needsUpdate = true;


            if (this.props.isActive) document.getElementById(scene.img).play();
            this.videoTextures = video;
            this.masksTextures = masks;
        }, 50);
    }

    componentWillUnmount(){
        delete document.querySelector('a-scene').systems.material.textureCache[this.props.scene.img];
        (this.videoTextures?this.videoTextures:[]).forEach(t => t.dispose());
        (this.masksTextures?this.masksTextures:[]).forEach(t => t.dispose());
    }
}