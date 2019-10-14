import RuleActionTypes from "../../rules/RuleActionTypes";
import settings from "../../utils/settings";
import store_utils from '../../data/stores_utils'
import AudioManager from './AudioManager'
import Values from '../../rules/Values';
import './aframe_shader'
const THREE = require('three');
const soundsHub = require('./soundsHub');

function executeAction(VRScene, rule, action){
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let actual_scene_name = VRScene.state.activeScene.name;
    let actual_scene_img = VRScene.state.activeScene.img;
    let actual_scene_Uuid = VRScene.state.activeScene.uuid;
    let game_graph = VRScene.state.graph;
    let current_object = game_graph['objects'].get(rule.event.obj_uuid);
    let sceneName = action.subj_uuid;
    let action_obj_uuid = action.obj_uuid;
    let cursor = document.querySelector('#cursor');
    switch (action.action) {
        case RuleActionTypes.TRANSITION:
            /*
            * Azione che si occupa di gestire la transizione, se la transizione ha un video associato avvia la transizione
            * avvia la transizione solo dopo aver riprodotto il video
            */
            //TODO al momento e' possibile effettuare transizione anche senza un oggetto, decidere se eliminarlo o tenerlo
            let duration_transition = 0;
            let duration = 0;
            //Se devo cambiare lo sguardo aggiungo 400 ms per dare il tempo alla camera di girare
            if(current_object) {
                if(current_object.properties.duration && current_object.type === 'POINT_OF_INTEREST')
                    duration = parseInt(current_object.properties.duration) + 400;
                else
                    duration = parseInt(current_object.properties.duration);
            }
            //se la transizione ha solo il fade-in e fade-out la direzione resta nothing, altrimenti verrà cambiata con quella scelta dall'utente
            let direction = 'nothing';
            if(current_object && current_object.properties.duration)
                direction = current_object.properties.direction;
            let objectVideo_transition = 0;
            cursor.setAttribute('material', 'visible: false');
            cursor.setAttribute('raycaster', 'far: 0.1');

            //Se la transizione ha un video associato lo riproduco e salvo la durata,
            if(current_object && current_object.type === 'TRANSITION'){
                objectVideo_transition = document.querySelector('#media_' + current_object.uuid);
                if(objectVideo_transition != null && objectVideo_transition.nodeName === 'VIDEO') {
                    objectVideo_transition.play();
                    duration_transition = (parseInt(objectVideo_transition.duration) * 1000);
                }
            }

            //Se la transizione ha un audio associato lo eseguo
            let audioTransition;
            if(current_object){
                audioTransition = current_object.audio.audio0;
                if(soundsHub['audio0_' + audioTransition])
                    soundsHub['audio0_' + audioTransition].play();
            }


            setTimeout(function () {
                //Set di controlli per la cotinuita' dei file audio, musica di sottofondo, effetti audio di sottofondo, audio integrato del video
                //Cambio musica di sottofondo da una scena ad un'altra
                if((soundsHub['audios_' + VRScene.state.activeScene.music] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music]   &&
                  (soundsHub['audios_' + VRScene.state.activeScene.music] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.music] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music] === undefined)){
                    soundsHub['audios_' + VRScene.state.activeScene.music].pause()
                    soundsHub['audios_' + VRScene.state.activeScene.music].currentTime = 0;
                }

                //Cambio effetti di sottofondo da una scena ad un'altra
                if((soundsHub['audios_' + VRScene.state.activeScene.sfx] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx]   &&
                        (soundsHub['audios_' + VRScene.state.activeScene.sfx] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.sfx] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx] === undefined)){
                    soundsHub['audios_' + VRScene.state.activeScene.sfx].pause()
                    soundsHub['audios_' + VRScene.state.activeScene.sfx].currentTime = 0;
                }

                //Cambio audio scena
                if((soundsHub['audios_' + VRScene.state.activeScene.uuid] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid]   &&
                        (soundsHub['audios_' + VRScene.state.activeScene.uuid] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.uuid] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid] === undefined)){
                    soundsHub['audios_' + VRScene.state.activeScene.uuid].pause();
                    soundsHub['audios_' + VRScene.state.activeScene.uuid].currentTime = 0;
                }

                //TODO, questo controllo serve se la transizione non ha oggetto, decidere se eliminarlo
                if(current_object === undefined)
                    transition(state.activeScene, state.graph.scenes[action_obj_uuid], duration, direction);
                else {
                    if(objectVideo_transition !== 0 && objectVideo_transition !== null &&
                        (store_utils.getFileType(objectVideo_transition.img) === 'video')) objectVideo_transition.pause();
                    // se le due scene sono dello stesso tipo le gestisco allo stesso modo
                    if(VRScene.state.activeScene.type === Values.THREE_DIM && state.graph.scenes[action_obj_uuid].type === Values.THREE_DIM ||
                        VRScene.state.activeScene.type === Values.TWO_DIM && state.graph.scenes[action_obj_uuid].type === Values.TWO_DIM)
                        transition(state.activeScene, state.graph.scenes[action_obj_uuid], duration, direction);
                    else
                        transition2D(state.activeScene, state.graph.scenes[action_obj_uuid], duration, VRScene)
                }

            },duration_transition);

            break;
        case RuleActionTypes.CHANGE_STATE:
            /*
            * Azione che si occupa di gestire il cambio di stato dei vari oggetti, vengono richiamate le funzioni
            * corrispondenti a seconda dell'oggetto coinvolto, per chiavi e luchetti la funzione e' la stessa,
            * lo switch ha una funzione sua
            */
            switch (action.obj_uuid){
                //Azione che cambia stato utilizzando la regola cambia stato
                case 'ON':
                case 'OFF':
                    changeStateSwitch(VRScene, runState, current_object, cursor, action);
                    break;
                case 'COLLECTED':
                    changeStateObject(VRScene, runState, game_graph, 'COLLECTED', current_object, action.subj_uuid);
                    break;
                case 'UNLOCKED':
                    changeStateObject(VRScene, runState, game_graph, 'UNLOCKED', current_object, action.subj_uuid);
                    break;
            }
            break;
        case RuleActionTypes.ON:
            /*
            * Azione che si occupe del cambio stato utilizzando la regola 'accendi'
            */

            //Verifico se lo stato e' spento, se no non faccio nulla
            if(runState[current_object.uuid].state === "OFF"){
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_'+current_object.uuid);

                //Controllo se l'interrutto ha un vedio associato, se si calcolo la durata del video, poi disattivo il mouse
                if(switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if(store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }

                //Riattivo il mouse e eseguo un cambio di stato e la salvo in runState, e aggiorno lo stato di VRScene
                setTimeout(function () {
                    cursor.setAttribute('raycaster', 'far: 10000');
                    cursor.setAttribute('material', 'visible: true');
                    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                    cursor.setAttribute('color', 'black');
                    runState[current_object.uuid].state = "ON";
                    VRScene.setState({runState: runState});
                },duration_switch);

            }
            break;
        case RuleActionTypes.OFF:
            /*
            * Azione che si occupe del cambio stato utilizzando la regola 'spegni'
            */
            if(runState[current_object.uuid].state === "ON"){
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_'+current_object.uuid);

                //Controllo se l'interrutto ha un vedio associato, se si calcolo la durata del video, poi disattivo il mouse
                if(switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if(store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
                    duration_switch = (switchVideo.duration * 1000);
                }

                //Riattivo il mouse e eseguo un cambio di stato e la salvo in runState, e aggiorno lo stato di VRScene
                setTimeout(function () {
                    cursor.setAttribute('raycaster', 'far: 10000');
                    cursor.setAttribute('material', 'visible: true');
                    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                    cursor.setAttribute('color', 'black');
                    runState[current_object.uuid].state = "OFF";
                    VRScene.setState({runState: runState});
                },duration_switch);

            }
            break;
        case RuleActionTypes.CHANGE_BACKGROUND:
            /*
            * Azione che si occupa di effettuare un cambio sfondo della scena
            */
            let targetSceneVideo = document.getElementById(action_obj_uuid);

            //let primitive = targetSceneVideo.nodeName === 'VIDEO'?"a-videosphere":"a-sky";
            //let actualSky = document.querySelector('#' + actual_scene);
            //actualSky.setAttribute('primitive', primitive)
            //TODO questo non ha molto senso
            if(soundsHub["audios_"+ actual_scene_Uuid]){
                soundsHub["audios_"+ actual_scene_Uuid].pause();
                let audioVideo = {};
                audioVideo.file = action_obj_uuid;
                audioVideo.loop = soundsHub["audios_"+ actual_scene_Uuid].loop;
                audioVideo.volume = 80;
                soundsHub["audios_"+ actual_scene_Uuid] = AudioManager.generateAudio(audioVideo, [0,0,0]);
                soundsHub["audios_"+ actual_scene_Uuid].play()
            }
            //Se il nuovo sfondo e' un video lo mando in riproduzione
            if(targetSceneVideo.nodeName === 'VIDEO') {targetSceneVideo.play();}
            //Segnalo allo shader che deve aggiornarsi e poi aggiorno lo stato di VRScene
            document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
            runState[sceneName].background = action_obj_uuid;
            VRScene.setState({runState: runState, game_graph: game_graph});
            break;
        case RuleActionTypes.PLAY:
            /*
            * Azione che si occupa di riprodurre un video o audio, nel caso sia un video ha la sola funziona di cambiare lo
            * stato interno della'attributo loop, se si tratta di un audio cambia lo stato di loop e riprodutce un audio
            * */

            //Controllo se si tratta di un video o un audio
            if(soundsHub["audios_"+ action_obj_uuid]){
                soundsHub["audios_"+ action_obj_uuid].loop = false;
                soundsHub["audios_"+ action_obj_uuid].play();
            } else {
                if(document.getElementById(actual_scene_img) !== null){
                    let actualVideoLoop = document.getElementById(actual_scene_img);
                    if(actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = false;
                        //document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true
                    }
                    //VRScene.setState({runState: runState, game_graph: game_graph});
                }
            }
            break;
        case RuleActionTypes.PLAY_LOOP:

            /*
            * Azione che si occupa di riprodurre un video o audio, nel caso sia un video ha la sola funziona di cambiare lo
            * stato interno della'attributo loop, se si tratta di un audio cambia lo stato di loop e riprodutce un audio
            * */
            //TODO rivedere questi controlli fanno un po' schifo
            if(soundsHub["audios_"+ action_obj_uuid]){
                soundsHub["audios_"+ action_obj_uuid].loop = false;
                soundsHub["audios_"+ action_obj_uuid].play();
            } else {
                if(document.getElementById(actual_scene_img) !== null){
                    let actualVideoLoop = document.getElementById(actual_scene_img);
                    if(actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = true;
                    }
                }
            }
            break;
        case RuleActionTypes.STOP:
            /*
            * Azione che si occupa di fermare la riproduzione di oggetti audio
            */

            if(soundsHub["audios_"+ action_obj_uuid] && document.querySelector('media_' + action_obj_uuid) === null)
                soundsHub["audios_"+ action_obj_uuid].stop();
            break;
        case RuleActionTypes.COLLECT_KEY:
            /*
            * Azione che si occupa di raccogliere una chiave
            */
            changeStateObject(VRScene, runState, game_graph, 'COLLECTED', current_object, action.obj_uuid);
            break;
        case RuleActionTypes.UNLOCK_LOCK:
            /*
            * Azione che si occupa di aprire un lucchetto
            */
            changeStateObject(VRScene, runState, game_graph, 'UNLOCKED', current_object, action.obj_uuid);
            break;
        case RuleActionTypes.CHANGE_VISIBILITY:
            /*
            * Azione che si occupa di cambiare la visibilita', intesa come interagibilita' del cursore su un oggetto
            */
            let obj = document.querySelector('#curv' + action.subj_uuid);
            let mediaObj = document.querySelector('#media_' + action.subj_uuid);
            if(obj)
                obj.setAttribute('selectable', {visible: action.obj_uuid});
            runState[action.subj_uuid].visible=action.obj_uuid;
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.LOOK_AT:
            /*
            * Azione che si occupa di girare la camera verso un punto ben preciso impostato dall'utente
            */
            if(VRScene.state.activeScene.type === '3D'){
                let delay = game_graph['objects'].get(action.obj_uuid).properties.delay;
                setTimeout(function () {
                    let pointOI = game_graph['objects'].get(action.obj_uuid);
                    lookObject('curv' + action.obj_uuid, pointOI.vertices);
                }, delay)
            }
            break;
        case RuleActionTypes.DECREASE_STEP:
            /*
            * Azione che si occupa di decrementare  il valore del contattore, di uno step
            */
            if (runState[action.subj_uuid].state >= 0){
                runState[action.subj_uuid].state = parseInt(runState[action.subj_uuid].state);
                runState[action.subj_uuid].state -= parseInt(game_graph['objects'].get(action.subj_uuid).properties.step);
            }

            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.INCREASE_STEP:
            /*
            * Azione che si occupa di incrementare  il valore del contattore, di uno step
            */
            runState[action.subj_uuid].state = parseInt(runState[action.subj_uuid].state);
            runState[action.subj_uuid].state += parseInt(game_graph['objects'].get(action.subj_uuid).properties.step);
            console.log('CIAOOOOOOO sono un contatore, il mio valore incrementato è: ')
            console.log(runState[action.subj_uuid].state)
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.INCREASE:
            /*
            * Azione che si occupa di assegnare un valore scelto dall'untente, al contattore*/
            runState[action.subj_uuid].state = parseInt(action.obj_uuid);
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        default:
            console.log('not yet implemented');
            console.log(action);
    }
}

/**
 * Function that manages the transitions
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition(actualScene, targetScene, duration, direction){
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    if(store_utils.getFileType(actualScene.img) === 'video') actualSceneVideo.pause();
    //TODO a volte non trova la scena, verificare perché
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let actualMove = new CustomEvent(actualSky.id + "actual");
    let targetMove = new CustomEvent(targetSky.id + "target");
    let sceneMovement = true;
    let is3dScene = actualScene.type===Values.THREE_DIM;
    let positionTarget;
    let positionActual;
    let canvasWidth = document.documentElement.clientWidth / 100;
    let canvasHeight = canvasWidth /1.77;
    switch (direction) {
        case 'RIGHT':
            positionTarget = canvasWidth + ', 1.6, -6';
            positionActual = -canvasWidth + ', 1.6, -6';
            break;
        case 'LEFT':
            positionTarget = -canvasWidth + ', 1.6, -6';
            positionActual =canvasWidth + ', 1.6, -6';
            break;
        case 'UP':
            positionTarget = '0, ' + (canvasHeight + 1.6) + ', -6';
            positionActual = '0, ' + (-canvasHeight + 1.6) + ', -6';
            break;
        case 'DOWN':
            positionTarget = '0, ' + (-canvasHeight + 1.6) + ', -6';
            positionActual = '0, ' + (canvasHeight + 1.6) + ', -6';
            break;
        default:
            positionTarget = "0, 1.6, -6";
            positionActual = "0, 1.6, -6";
            break;
    }
    if(targetScene.type === Values.TWO_DIM) targetSky.setAttribute('position', positionTarget);

    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");
    //TODO impostare uno dei valori da editor a nessuno o una direzione, differenziare anceh se
    // sono scene 3D o 2D, nel 3D non vogliamo questo effetto, credo
    if(sceneMovement && !is3dScene){
        actualSky.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: 0 1.6 -6; ' +
            'to: '+ positionActual +'; startEvents: ' + actualSky.id + "actual")
        targetSky.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: '+ positionTarget +'; ' +
            'to: 0 1.6 -6; startEvents: ' + targetSky.id + "target")
    }
    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');

    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');
    actualSky.dispatchEvent(disappear);

    if(is3dScene){
        setTimeout(function () {
                targetSky.dispatchEvent(appear);}
            , parseInt(duration)
        );
    } else {
        targetSky.dispatchEvent(appear);
    }

    //targetSky.dispatchEvent(appear);

    if(sceneMovement && !is3dScene){
        actualSky.dispatchEvent(actualMove);
        targetSky.dispatchEvent(targetMove);
    }
    setTimeout(function () {if(store_utils.getFileType(targetScene.img) === 'video'){
        targetSceneVideo.currentTime = 0;
        targetSceneVideo.play();
        } }
        , parseInt(duration)
    );

    //if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
}

/**
 * Function called only in transioto between diferent type of scene, 3D -> 2D or 2D -> 3D
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition2D(actualScene, targetScene, duration){
    let camera = document.getElementById('camera');
    let cursor = document.getElementById('cursor');
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let is3dScene = actualScene.type===Values.THREE_DIM;
    let sceneMovement = is3dScene?targetSky:actualSky;
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let movement = new CustomEvent(sceneMovement.id + "move");


    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");

    if(is3dScene){
        sceneMovement.setAttribute('animation__moving', 'property: position; dur: '+ duration +
            '; easing: linear; from: 0 1.6 -9; ' +
            'to: 0 1.6 -6; startEvents: ' + sceneMovement.id + "move")
    } else {
        sceneMovement.setAttribute('animation__moving', 'property: position; dur:' + duration +
        '; easing: linear; from: 0 1.6 -6; ' +
            'to: 0 1.6 -9; startEvents: ' + sceneMovement.id + "move")
    }
    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');

    if(store_utils.getFileType(actualScene.img) === 'video') actualSceneVideo.pause();
    actualSky.dispatchEvent(disappear);
    if(!is3dScene) {
        sceneMovement.dispatchEvent(movement);
    }
    setTimeout(function () {
        lookObject(targetSky.id);
        targetSky.dispatchEvent(appear);
        sceneMovement.dispatchEvent(movement);
        if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
    },duration);

}

function lookObject(idObject, pointOI = null){
    let obj = document.getElementById(idObject);
    let center;
    let l;
    let camera = document.getElementById('camera');
    let cameraPosition = camera.getAttribute('position');
    let euler = new THREE.Euler();
    let quaternion = new THREE.Quaternion();
    let v = new THREE.Vector3(cameraPosition.x, cameraPosition.y, -10).normalize()
    if(obj !== null){
        obj.components.geometry.geometry.computeBoundingSphere();
        center = obj.components.geometry.geometry.boundingSphere;
        l = center.center.normalize();
        quaternion.setFromUnitVectors(v, l);
        euler.setFromQuaternion(quaternion, 'YXZ', false);
    }

    if(pointOI === null){
        camera.setAttribute("pac-look-controls", "planarScene: true" );
        camera.setAttribute("pac-look-controls", "pointerLockEnabled: false" );
    } else {
        let points = pointOI.split(' ').map(function(x){return parseFloat(x);});
        let p = new THREE.Vector3( points[0], points[1], points[2] );
        l = p.normalize();
        quaternion.setFromUnitVectors(v, l);
        euler.setFromQuaternion(quaternion, 'YXZ', false);
    }
    camera.components["pac-look-controls"].yawObject.rotation._y = euler._y;
    camera.components["pac-look-controls"].yawObject.rotation._x = 0;
    camera.components["pac-look-controls"].yawObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._x = euler._x;
    camera.components["pac-look-controls"].pitchObject.rotation._z =  0;
    camera.components["pac-look-controls"].pitchObject.rotation._y =  0;
    //document.exitPointerLock()
}

/**
 * Function for play the audio and update the state of a object
 * @param VRScene
 * @param runState
 * @param game_graph
 * @param state
 * @param current_object
 * @param action_uuid
 */
function changeStateObject(VRScene, runState, game_graph, state, current_object, action_uuid){
    runState[action_uuid].state=state;
    let audioKey = current_object.audio.audio0;
    if(soundsHub['audio0_' + audioKey])
        soundsHub['audio0_' + audioKey].play();
    game_graph.scenes[VRScene.state.activeScene.uuid].objects.collectable_keys =
        game_graph.scenes[VRScene.state.activeScene.uuid].objects.collectable_keys.filter(obj =>  obj.uuid !== current_object.uuid);
    if(current_object.media0 !== null){
        document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
    }
    VRScene.setState({runState: runState, graph: game_graph});
}

function changeStateSwitch(VRScene, runState, current_object, cursor, action) {
    let duration_switch = 0;
    let switchVideo = document.getElementById('media_'+current_object.uuid);
    console.log(switchVideo)
    if(switchVideo != null) {
        cursor.setAttribute('material', 'visible: false');
        cursor.setAttribute('raycaster', 'far: 0.1');
        let videoType = current_object.properties.state === 'ON'?current_object.media.media0:current_object.media.media1;


        if(store_utils.getFileType(videoType) === 'video') {switchVideo.play();}
        duration_switch = (parseInt(switchVideo.duration) * 1000);
    }

    let audio = current_object.properties.state === 'ON'?current_object.audio.audio0:current_object.audio.audio1
    let idAudio = current_object.properties.state === 'ON'?'audio0_':'audio1_';
    if(soundsHub[idAudio + audio])
        soundsHub[idAudio + audio].play();

    setTimeout(function () {
        cursor.setAttribute('raycaster', 'far: 10000');
        cursor.setAttribute('material', 'visible: true');
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        cursor.setAttribute('color', 'black');
        document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
        runState[action.subj_uuid].state = action.obj_uuid;
        VRScene.setState({runState: runState});

    },duration_switch)

}
export {executeAction,
lookObject}