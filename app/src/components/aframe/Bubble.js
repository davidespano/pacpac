/**
 * Bubble e' un componente React che ha la funzione di creare una bolla in base ai parametri che VRScene gli passa,
 * gestisce le opzioni di visualizzazione di una bolla se essa e' un bolla corrente o una vicina, gestisce gli oggetti
 * in essa contenuta, tenendo sempre in considerazione se e' attiva o no.
 * Inoltre si occupa di gestire lo shader nel momento in cui gli oggetti hanno un media associato, quindi li fonde con
 * il media di sfondo.
 * Questo componente viene utlizziato sia da VRScene che sa GeometryScene, che in nella modalita' dubug
 * Costruisce la bolla sia che sia di tipo 3D o 2D
 */

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

        // Riattivo il cursore, e resetto evento animation complete, se non lo faccio l'evento animationComplete non verra' piu' lanciato
        this.nv.addEventListener("animationcomplete", function animationListener(evt){
            if(evt.detail.name === "animation__appear" /*&& is3Dscene*/)
            {
                //Riattivo la lunghezza del raycast
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

        //Chiamo la funzione setShader che si occupera' della creazione della shader, nel caso in sui sia necessario
        this.setShader();

        //dobbiamo eliminare gli ultimi millisecondi dal video per evitare frame neri
        if(stores_utils.getFileType(this.props.scene.img) === 'video') this.setVideoFrame(); //[Vittoria] lasciare così
    }

    //[Vittoria] funzione che aggiorna se riceve component
    componentWillReceiveProps({props}) {
        this.setState({...this.state,props})
    }

    componentDidUpdate(){

        //Riavolgo i video delle bolle adiacenti, se sono gia' stati avviati in precedenza non partono in automatico dall'inizio
        if(!this.props.isActive) { //[Vittoria] se non è la scena attiva se ci sono dei video li riporta a zero
            Object.values(this.props.scene.objects).flat().forEach(obj => {
                if(obj.media) {
                    Object.values(obj.media).forEach(media => {
                        if (media !== null)
                            document.getElementById("media_" + obj.uuid).currentTime = 0; //[Vittoria] riavvolge il video
                    });
                }
            })
        }else{ //[Vittoria] se è la scena attiva richiama lo shader
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

    /**
     * Funzione che si occupa di eliminare gli ultimi millisecondi dal video decrementando il currentTime
     */
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
        let background = this.props.runState?this.props.runState[scene.uuid].background:scene.img; //Prendo lo sfondo o dal runStato o o dalla scena corrente
        let is3Dscene = this.props.scene.type===Values.THREE_DIM;
        let primitive = stores_utils.getFileType(this.props.scene.img)==='video'?"a-videosphere":"a-sky"; //Controllo se il media e' un video nel caso utilizzo 'a-videosphere' di A-Frame
        // TODO verificare che a-sky non dia problemi con i video, se non dà problemi cancella il controllo della riga sopra di questa
        //let primitive = this.props.assetsDimention.type === 'video'?"a-videosphere":"a-sky";
        let positionCurved = is3Dscene?"0, 0, 0":"0, -1.6, 6"; //Se la scena e' di tipo 3D metto la bolla al centro, altrimento posiziono il piano in un punto fisso
        //let positionPlane = this.props.isActive?"0, 1.6, -6.44":"0, 1.6, -9";
        //[Vittoria] se per caso un animazione da 2D a 3D e viceversa non abbiamo l'animazione il motivo è che il controllo sopra questa riga è commentato
        let positionPlane;
        let sceneRender;

        //[Vittoria] Ho due tipi di scena: 2D (piano) e 3D (bolla), le transizioni tra le due cose
        //se invece la scena principale è la bolla e vado verso un piano, la bolla scompare e il piano va verso di me
        //se sono dello stesso tipo invece si "annullano"
        // se vado da una scena con piano verso una bolla, la bolla prende tutto

        //Genero le zone interattive utilizzando i componenti Curved in base al tipo di scena che devo renderizzare
        const curves = Object.values(scene.objects).flat().map(curve => {
            let color = this.props.curvedToEdit===curve.uuid?'red':'white';
            if(this.props.editMode){
                let pointOfinterest = curve.type === 'POINT_OF_INTEREST';
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

        //Se la scena e' quella attiva imposto i parametri neccessari in modo che sia visibile, se e' una bolla vicina larendo invisibile
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
        } else material += "opacity: 0; visible: false";
        let camera = document.getElementById('camera');

        //Genero la bolla in base al tio 3D o 2D
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

            let Width = this.props.assetsDimention.width ;
            let Height = this.props.assetsDimention.height ;
            let ratio;
            /*let ratio = Width/Height;
            let ratio2 = document.documentElement.clientWidth / document.documentElement.clientHeight;
            let canvasWidth ;
            let canvasHeight;

            if(ratio > 1 && ratio2 < 1){
                canvasWidth = document.documentElement.clientWidth / 100;
                canvasHeight = canvasWidth / ratio ;
            } else {

                canvasHeight = document.documentElement.clientHeight / 100;
                canvasWidth = canvasHeight * ratio;

            }*/

            let canvasWidth ;
            let canvasHeight;

            // numeri stabiliti empiricamente per la distanza e posizione corrente per la camera
            let maxH = 10;
            let maxW = 10;


            if(Width > Height){
                if(document.documentElement.clientWidth > document.documentElement.clientHeight){
                    canvasHeight = maxH;
                    canvasWidth = (maxH / Height) * Width;
                }else{
                    canvasWidth = maxW;
                    canvasHeight = (maxW / Width) * Height;
                }


            }else{
                if(document.documentElement.clientWidth > document.documentElement.clientHeight){
                    canvasHeight = maxH;
                    canvasWidth = (maxH / Height) * Width;
                }else{
                    canvasWidth = maxW;
                    canvasHeight = (maxW / Width) * Height;
                }

            }





            console.log("Asset: " + this.props.assetsDimention.width + " " + this.props.assetsDimention.height);
            console.log("Dimension:" + canvasWidth + " " + canvasHeight);

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

            //[Vittoria] sky: bolle
            //Verifico se lo shader attuale e' multi-video (quello creato da noi), e se non ha bisogno di essere aggiornato, riproduco il video di sfondo, se e' un video
            if(sky && sky.getAttribute('material').shader === 'multi-video' && !(this.nv !== undefined && this.nv.needShaderUpdate === true)) {
                if (this.props.isActive && stores_utils.getFileType(scene.img) === 'video') document.getElementById(scene.img).play();
                return;
            }

            //Imposto la variabile per l'aggiornamento a false
            if((this.nv !== undefined && this.nv.needShaderUpdate === true)) this.nv.needShaderUpdate = false;

            //Creo il la texture in base al tipo di media dello sfondo
            if(stores_utils.getFileType(scene.img) === 'video'){  //[Vittoria]se lo sfondo è un video
                aux = new THREE.VideoTexture(document.getElementById(scene.img));  //[Vittoria] creo un THREE.VideoTexture
            } else {
                aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + background);  //[Vittoria] se è un img creo un THREE.TextureLoader
            }
            aux.minFilter = THREE.NearestFilter;  //[Vittoria] adesso aux ha lo sfondo
            //Aggiungo alla lista di media lo sfondo, questa lista sara' utilizzata per fondere i media in essa contenuiti
            video.push(aux);

            //Scorro tutti gli oggetti, se hanno un media associato lo aggiungo alla lista video
            objs.forEach(obj => {
                //each object with both a media and a mask must be used in the shader
                let asset = document.getElementById("media_" + obj.uuid);
                let media;

                // TODO verificare i media per oggetti diversi da switch
                //Controllo se l'oggetto corrente e' uno switch, in quel caso quale media devo prendere se da ON a OFF o viceversa
                if(this.props.runState && obj.type === "SWITCH" && this.props.runState[obj.uuid].state === "ON"){
                    if(obj.media.media1)
                        media = obj.media.media1;
                }
                else{
                    if(obj.media && obj.media.media0)  //[Vittoria] ha il media OFF -> ON
                        media = obj.media.media0;
                }

                //Se l'oggetto non ha un media passo al prossimo
                if (asset === null) return;

                if(asset.nodeName === 'VIDEO'){
                    aux = new THREE.VideoTexture(asset);
                } else {
                    aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + media);
                }

                //Aggiungo il media alla lista video
                aux.minFilter = THREE.NearestFilter;
                video.push(aux);

                //Carico la maschera associata al media dell'oggetto
                aux = new THREE.TextureLoader().load(`${mediaURL}${id}/` + obj.mask);
                aux.minFilter = THREE.NearestFilter;
                masks.push(aux);
                dict.push(obj.uuid.replace(/-/g,'_'));
            });

            //Controllo se ci sono maschere o no, se non ci sono maschere resetto lo shader, perche' non neccessario
            if (masks.length === 0) {
                this.resetShader(sky);
                return; //shader not necessary
            }
            //[Vittoria] Fino a qua abbiamo due array: uno di video e uno di maschere, posso creare lo shader

            //[Vittoria] setto il material della bolla come multivideo, se non lo è già
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

            if (skyMesh == null) return;  //[Vittoria] in questo caso è un oggetto mesh

            let i;
            let declarations = "";

            //[Vittoria] lo shader è una stringa di testo, ciclo per video e maschere e creo un material uniform (dove ci sono quelle info)


            //Per ogni oggetto genero la stringa che sara' utilizzata dall shader per fondere i media con le maschere
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
            //[Vittoria] la stringa dello shader ha info riguardanti video e maschera ed è fatta così:
            let mixFunction = `mix(texture2D(video0,vUv),texture2D(video${dict[1]}, vUv),texture2D(mask${dict[1]}, vUv).y)`;
            //[Vittoria] questo è il punto dove creo effettivamente lo shader (tramite la fusione descritta sopra) e produrrà la maxi stringa
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

            //[Vittoria] una volta fatto tutto questo se è un video lo mando in play, altrimenti è un'immagine
            if (this.props.isActive && stores_utils.getFileType(this.props.scene.img) === 'video') {document.getElementById(scene.img).play()};
            this.videoTextures = video;
            this.masksTextures = masks;
        }, 50);
    }

    /**
     * Funzione che si occupa di impostare lo shader a quello flat, che è lo shader base
     * @param sky
     */
    resetShader(sky){

        //TODO [debug] add to origin master
        if(sky && sky.getAttribute('material').shader !== 'multi-video'){
            return;
        }
        if(sky){
            sky.setAttribute('material', "shader:flat;");
        }

    }

    //[Vittoria] elimina dalla cache immagini e video, senza questa spostandoci da una scena all'altra rimangono in cache
    componentWillUnmount(){
        delete document.querySelector('a-scene').systems.material.textureCache[this.props.scene.img];
        (this.videoTextures?this.videoTextures:[]).forEach(t => t.dispose());
        (this.masksTextures?this.masksTextures:[]).forEach(t => t.dispose());
    }

}

