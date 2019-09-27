import React,{Component} from "react";
import {Entity} from 'aframe-react';
import {Curved, CurvedGeometry} from './aframe_curved';
import settings from "../../utils/settings";
import '../../data/stores_utils'
import stores_utils from "../../data/stores_utils";
import Values from '../../rules/Values'
import './aframe_shader'
import AudioManager from './AudioManager'
const soundsHub = require('./soundsHub');
const THREE = require('three');
const {mediaURL} = settings;


export default class Bubble extends Component
{
    constructor(props){
        super(props)
        //console.log(props)
    }

    componentDidMount()
    {
        let el = this;
        let is3Dscene = this.props.scene.type===Values.THREE_DIM;
        let cursor = document.querySelector('#cursor');

        // Riattivo il cursore, e resetto evento animation complete
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear" /*&& is3Dscene*/)
            {
                //Riattivo la lunghezza del raycast
                let cursor = document.querySelector("#cursor");
                cursor.setAttribute('raycaster', 'far: 10000');
                cursor.setAttribute('material', 'visible: true');
                cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                cursor.setAttribute('color', 'black');
                el.props.handler(el.props.scene.uuid);
            }
            this.components[evt.detail.name].animation.reset();
        });

        // Se la scena è 2D rendo invisibile il cursor, uso solo il mouse (potrebbe non servire)
        if(!is3Dscene && this.props.isActive) {
            //cursor.setAttribute('material', 'visible: false');
        }
        this.setShader();
        if(stores_utils.getFileType(this.props.scene.img) === 'video') this.setVideoFrame();
    }

    componentWillReceiveProps({props}) {
        this.setState({...this.state,props})
    }

    componentDidUpdate(){
        if(!this.props.isActive) {
            Object.values(this.props.scene.objects).flat().forEach(obj => {
                if(obj.media) {
                    Object.values(obj.media).forEach(media => {
                        if (media !== null)
                            document.getElementById("media_" + obj.uuid).currentTime = 0;
                    });
                }
            })
        }else{
            //if(stores_utils.getFileType(this.props.scene.img) === 'video') this.setShader();
            this.setShader();
        }

        // Check forzare l'aggiornamento della camera nella nuova scena se passo da 2D a 3D o viceverse
        let is3Dscene = this.props.scene.type === Values.THREE_DIM;
        let camera = document.getElementById('camera');
        if(camera.getAttribute("pac-look-controls").pointerLockEnabled !== is3Dscene && this.props.isActive && !this.props.editMode)
            this.props.cameraChangeMode(is3Dscene)

        this.setVideoFrame();
    }

    setVideoFrame(){
        if(!this.props.isActive) return;
        this.props.scene.objects.switches.forEach(s => {
            let state = this.props.runState?this.props.runState[s.uuid].state:s.state;
            if(s.media.media0 === null && s.media.media1 === null) return;
            if((state === "ON"  && s.media.media1 === null )||
               (state === "OFF" && s.media.media0 === null )){
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
        let background = this.props.runState?this.props.runState[scene.uuid].background:scene.img;
        console.log(this.props.runState)
        let is3Dscene = this.props.scene.type===Values.THREE_DIM;
        let primitive = stores_utils.getFileType(this.props.scene.img)==='video'?"a-videosphere":"a-sky";
        //let primitive = "a-sky";
        //let primitive = this.props.assetsDimention.type === 'video'?"a-videosphere":"a-sky";
        let positionCurved = is3Dscene?"0, 0, 0":"0, -1.6, 6";
        //let positionPlane = this.props.isActive?"0, 1.6, -6.44":"0, 1.6, -9";
        let positionPlane;
        let sceneRender;

        const curves = Object.values(scene.objects).flat().map(curve => {
            let color = this.props.curvedToEdit===curve.uuid?'red':'white';
            if(this.props.editMode){
                let pointOfinterest = curve.type === 'POINT_OF_INTEREST'
                return(
                    <CurvedGeometry key={"keyC"+ curve.uuid}
                                    position={positionCurved}
                                    vertices={curve.vertices}
                                    id={curve.uuid}
                                    is3Dscene={is3Dscene}
                                    color={color}
                                    type={pointOfinterest}
                                    assetsDimention = {this.props.assetsDimention}
                    />
                );
            } else {
                //TODO [debug] add to origin master
                return(
                    <Curved key={"keyC"+ curve.uuid}
                            onDebugMode={this.props.onDebugMode}
                            position={positionCurved}
                            object_uuid={this.props.isActive?curve.uuid:""}
                            is3Dscene={is3Dscene}
                            vertices={curve.vertices}
                            visible={this.props.runState[curve.uuid].visible}
                            type={curve.type}
                            assetsDimention = {this.props.assetsDimention}/>
                );
            }
        });
        let material = "depthTest: true; ";
        let active = 'active: false;';
        let radius = 9.9;
        let music;
        let sfx;
        let audioVideo = {};
        //creazione musica sottofondo
        if(this.props.scene.music !== undefined && this.props.audios){
            music = this.props.audios[this.props.scene.music]
            let volume = this.props.onDebugMode?0:music.volume;
            if(soundsHub["audios_"+ music.uuid] === undefined)
                soundsHub["audios_"+ music.uuid] = AudioManager.generateAudio(music, [0,0,0], volume);
        }
        //creazione effetti sottofondo
        if(this.props.scene.sfx !== undefined && this.props.audios){
            sfx = this.props.audios[this.props.scene.sfx]
            let volume = this.props.onDebugMode?0:sfx.volume;
            if(soundsHub["audios_"+ sfx.uuid] === undefined){
                //sfx.volume = 50;
                soundsHub["audios_"+ sfx.uuid] = AudioManager.generateAudio(sfx, [0,0,0], volume);
            }
        }
        //Carico audio incorporato nel video
        if(this.props.isAudioOn){
            if(soundsHub["audios_"+ this.props.scene.uuid] === undefined){
                if(stores_utils.getFileType(scene.img) === 'video'){
                    let volume = this.props.onDebugMode?0:50;
                    let loop = scene.isVideoInALoop !== undefined ? scene.isVideoInALoop : false;
                    audioVideo.file = this.props.scene.img;
                    audioVideo.loop = loop;
                    audioVideo.volume = volume;
                    soundsHub["audios_"+ this.props.scene.uuid] = AudioManager.generateAudio(audioVideo, [0,0,0], volume);
                }
            }
        }
        if (this.props.isActive) {
            material += "opacity: 1; visible: true; side: double";
            active = 'active: true; video: ' + scene.img;
            radius = 10;
            if(!this.props.editMode){
                //play musica sottofondo
                if(music && soundsHub["audios_"+ music.uuid])
                    soundsHub["audios_"+ music.uuid].play();
                //play suoni ambientali
                if(sfx && soundsHub["audios_"+ sfx.uuid])
                    soundsHub["audios_"+ sfx.uuid].play();
                //play audio incorporato nel video
                if(audioVideo !== {} && soundsHub["audios_"+ this.props.scene.uuid])
                    soundsHub["audios_"+ this.props.scene.uuid].play();
            }
        }

        else material += "opacity: 0; visible: false";
        let camera = document.getElementById('camera');
        //primitive = "a-sky";
        if(is3Dscene){

            sceneRender = (
                <Entity _ref={elem => this.nv = elem} geometry="primitive: sphere"  scale={'-1 1 1 '} primitive={primitive} visible={this.props.isActive}
                                   id={this.props.scene.name} src={'#' + background} radius={radius}
                                   material={material} play_video={active}>
                {curves}
                </Entity>)
        } else {
            //TODO aggiungere il controllo del ridimensionamento della canvas
            //TODO trovare una formula per il calcolo della dimensione del piano

            let Width = this.props.assetsDimention.width / 100;
            let Height = this.props.assetsDimention.height / 100;
            let ratio = Width/Height;
            let ratio2 = document.documentElement.clientWidth / document.documentElement.clientHeight;
            let canvasWidth ;
            let canvasHeight;

            if(ratio > 1 && ratio2 < 1){
                canvasWidth = document.documentElement.clientWidth / 100;
                canvasHeight = canvasWidth / ratio ;
            } else {

                canvasHeight = document.documentElement.clientHeight / 100;
                canvasWidth = canvasHeight * ratio;

            }
            positionPlane = "0, 1.6, -6";
            sceneRender = (
                <Entity _ref={elem => this.nv = elem} primitive={'a-plane'} visible={this.props.isActive}
                    id={this.props.scene.name} src={'#' + background} height={canvasHeight.toString()} width={canvasWidth.toString()}
                    material={material} play_video={active} position={positionPlane} >
                {curves}
                </Entity>)
        }
        return(sceneRender);
    }

    setShader(){
        //console.log('set shader');
        setTimeout(() => { //timeout to wait the render of the bubble
            let scene = this.props.scene;
            let sky = document.getElementById(scene.name);
            let id = this.props.gameId ? this.props.gameId : `${window.localStorage.getItem("gameID")}`;
            let video = [];
            let masks = [];
            let aux;
            let dict = ['0'];
            let background = this.props.runState?this.props.runState[scene.uuid].background:scene.img;

            const objs = Object.values(scene.objects).flat(); //all the objects, whatever type
            //Se non ho oggetti resetto lo shader, non serve il nostro
            if (objs.length === 0){
                this.resetShader(sky);
                return; //shader not necessary
            }
            //TODO [debug] add to origin master
            if(sky && sky.getAttribute('material').shader === 'multi-video' && !(this.nv !== undefined && this.nv.needShaderUpdate === true)) {
                if (this.props.isActive && stores_utils.getFileType(scene.img) === 'video') document.getElementById(scene.img).play();
                return;
            }
            if((this.nv !== undefined && this.nv.needShaderUpdate === true)) this.nv.needShaderUpdate = false;

            if(stores_utils.getFileType(scene.img) === 'video'){
                aux = new THREE.VideoTexture(document.getElementById(scene.img));
            } else {
                aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + background);


            }
            console.log(aux)
            aux.minFilter = THREE.NearestFilter;
            video.push(aux);

            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                let asset = document.getElementById("media_" + obj.uuid);
                let media = obj.media.media0;
                if(this.props.runState && obj.type === "SWITCH" && this.props.runState[obj.uuid].state === "ON")
                    media = obj.media.media1;

                console.log(obj)
                if (asset === null) return;
                if(asset.nodeName === 'VIDEO'){
                    aux = new THREE.VideoTexture(asset);
                } else {
                    aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + media);
                }
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);
                aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + obj.mask);
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

            let i;
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
            setTimeout(()=>skyMesh.material.needsUpdate = true, 50);

            if (this.props.isActive && stores_utils.getFileType(this.props.scene.img) === 'video') document.getElementById(scene.img).play();
            this.videoTextures = video;
            this.masksTextures = masks;
        }, 50);
    }

    resetShader(sky){

        //TODO [debug] add to origin master
        if(sky && sky.getAttribute('material').shader !== 'multi-video'){
            return;
        }
        if(sky){
            sky.setAttribute('material', "shader:flat;");
        }

    }

    componentWillUnmount(){
        delete document.querySelector('a-scene').systems.material.textureCache[this.props.scene.img];
        (this.videoTextures?this.videoTextures:[]).forEach(t => t.dispose());
        (this.masksTextures?this.masksTextures:[]).forEach(t => t.dispose());
    }

}

