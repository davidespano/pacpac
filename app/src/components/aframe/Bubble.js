import React from "react";
import {Entity} from 'aframe-react';
import {Curved, Sound} from './aframe_entities';
import settings from "../../utils/settings";
import {Howl} from "howler";
import '../../data/stores_utils'
import stores_utils from "../../data/stores_utils";
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
        //if(stores_utils.getFileType(this.props.scene.img) === 'video')
        this.setShader();
        if(stores_utils.getFileType(this.props.scene.img) === 'video') this.setVideoFrame();
    }

    componentDidUpdate(){
        if(!this.props.isActive) {
            Object.values(this.props.scene.objects).flat().forEach(obj => {
                Object.values(obj.media).forEach(media=>{
                    if(media !== null)
                        document.getElementById("media_" + obj.uuid).currentTime = 0;
                });
            })
        }else{
            if(stores_utils.getFileType(this.props.scene.img) === 'video') this.setShader();
        }
        //let is3Dscene = !(this.props.scene.img === 'pianomp.mp4');
        //let camera = document.getElementById('camera');
        //if(camera.getAttribute("pac-look-controls").pointerLockEnabled !== is3Dscene && this.props.isActive) this.props.cameraChangeMode(is3Dscene)
        this.setVideoFrame();
    }

    setVideoFrame(){
        //if(!this.props.isActive) return;
        this.props.scene.objects.switches.forEach(s => {
            if(s.media.media0 === null && s.media.media1 === null) return;
            if((this.props.runState[s.uuid].state === "ON"  && s.media.media1 === null )||
               (this.props.runState[s.uuid].state === "OFF" && s.media.media0 === null )){
                let asset = document.getElementById("media_"+s.uuid);
                asset.addEventListener('durationchange', function (ev) {
                    asset.currentTime = asset.duration - 0.00005; //TODO test with longer video
                });
                if(asset.readyState > 0)
                    asset.currentTime = asset.duration - 0.00005; //TODO test with longer video
            }
        })
    }

    render() {
        //generate the interactive areas
        let scene = this.props.scene;
        let is3Dscene = !(this.props.scene.img === 'pianomp.mp4');
        console.log(this.props.scene.img)
        let sceneRender;
        let primitive = stores_utils.getFileType(this.props.scene.img)==='video'?"a-videosphere":"a-sky";

        const curves = Object.values(scene.objects).flat().map(curve => {
            return(
                <Curved key={"keyC"+ curve.uuid} object_uuid={this.props.isActive?curve.uuid:""} vertices={curve.vertices}/>
            );
        });
        let material = "depthTest: true; ";
        let active = 'active: false;';
        let radius = 9.9;
        if (this.props.isActive) {
            material += "opacity: 1; visible: true;";
            active = 'active: true; video: ' + scene.img;
            radius = 10;
        }
        else material += "opacity: 0; visible: false";


        if(/*is3Dscene*/true){
            sceneRender = (
                <Entity _ref={elem => this.nv = elem} primitive={primitive} visible={this.props.isActive}
                                   id={this.props.scene.name} src={'#' + this.props.scene.img} radius={radius}
                                   material={material} play_video={active}>
                {curves}
                </Entity>)
        } else {
            //TODO aggiungere il controllo del ridimensionamento della canvas
            let canvasWidth = document.documentElement.clientWidth / 100;
            let canvasHight = canvasWidth /1.77;
            //camera = document.getElementById('camera');
            //camera.setAttribute("pac-look-controls", "pointerLockEnabled: false");
            sceneRender = (
                <Entity _ref={elem => this.nv = elem} primitive={'a-plane'} visible={this.props.isActive}
                    id={this.props.scene.name} src={'#' + this.props.scene.img} height={canvasHight.toString()} width={canvasWidth.toString()}
                    material={material} play_video={active} position="0 1.6 -6.44"/*dolby={'active: ' + this.props.isActive.toString() + ';'}*/>
                {curves}
                </Entity>)
        }
        return(sceneRender);
    }

    setShader(){
        console.log('set shader');
        setTimeout(() => { //timeout to wait the render of the bubble
            let scene = this.props.scene;
            let sky = document.getElementById(scene.name);
            const objs = Object.values(scene.objects).flat(); //all the objects, whatever type
            if (objs.length === 0){
                this.resetShader(sky);
                return; //shader not necessary
            }
            if(sky.getAttribute('material').shader === 'multi-video' && !(this.nv !== undefined && this.nv.needShaderUpdate === true)) {
                if (this.props.isActive ) document.getElementById(scene.img).play();
                return;
            }
            if((this.nv !== undefined && this.nv.needShaderUpdate === true)) this.nv.needShaderUpdate = false;
            let video = [];
            let masks = [];
            let aux; //= new THREE.VideoTexture(document.getElementById(scene.img)); //background video
            if(stores_utils.getFileType(scene.img) === 'video'){
                aux = new THREE.VideoTexture(document.getElementById(scene.img));
            } else {
                aux = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/` +scene.img);
            }
            aux.minFilter = THREE.NearestFilter;
            video.push(aux);
            let dict = ['0'];
            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                let asset = document.getElementById("media_" + obj.uuid);
                if (asset === null) return;
                if(asset.nodeName === 'VIDEO'){
                    aux = new THREE.VideoTexture(asset);
                } else {
                    aux = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.media.media0);
                }
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);
                aux = new THREE.TextureLoader().load(`${mediaURL}${window.localStorage.getItem("gameID")}/` + obj.mask);
                aux.minFilter = THREE.NearestFilter;
                masks.push(aux);
                dict.push(obj.uuid.replace(/-/g,'_'));
            });

            if (masks.length === 0) {
                this.resetShader(sky);
                return; //shader not necessary
            }

            //set the shader
            if(sky.getAttribute('material').shader !== 'multi-video'){
                sky.setAttribute('material', "shader:multi-video;");
            }

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
            setTimeout(()=>skyMesh.material.needsUpdate = true ,50);


            if (this.props.isActive && stores_utils.getFileType(this.props.scene.img) === 'video') document.getElementById(scene.img).play();
            this.videoTextures = video;
            this.masksTextures = masks;
        }, 50);
    }

    resetShader(sky){
        if(sky.getAttribute('material').shader !== 'multi-video'){
            return;
        }
        sky.setAttribute('material', "shader:flat;");
    }
    componentWillUnmount(){
        delete document.querySelector('a-scene').systems.material.textureCache[this.props.scene.img];
        (this.videoTextures?this.videoTextures:[]).forEach(t => t.dispose());
        (this.masksTextures?this.masksTextures:[]).forEach(t => t.dispose());
    }
}