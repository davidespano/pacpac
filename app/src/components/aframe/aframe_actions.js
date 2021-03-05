import RuleActionTypes from "../../rules/RuleActionTypes";
import settings from "../../utils/settings";
import store_utils from '../../data/stores_utils'
import AudioManager from './AudioManager'
import Values from '../../rules/Values';
import './aframe_shader'
import SceneAPI from "../../utils/SceneAPI";
import InteractiveObjectsTypes from "../../interactives/InteractiveObjectsTypes";
import RulesStore from "../../data/RulesStore";
import create_scene2 from "./create_scene2";

const eventBus = require('./eventBus');
const THREE = require('three');
const soundsHub = require('./soundsHub');
const {mediaURL} = settings;

//[Vittoria] VRScene è createscene2
function executeAction(VRScene, rule, action) {
    let state = VRScene.state;
    let runState = VRScene.state.runState;
    let actual_scene_name = VRScene.state.activeScene.name;
    let actual_scene_img = VRScene.state.activeScene.img;
    let actual_scene_Uuid = VRScene.state.activeScene.uuid;
    let game_graph = VRScene.state.graph;
    let current_object = game_graph['objects'].get(action.obj_uuid);
    let sceneName = action.subj_uuid;
    let action_obj_uuid = action.obj_uuid;
    let cursor = document.querySelector('#cursor');
    let subject_obj = game_graph['objects'].get(action.subj_uuid);

    switch (action.action) {

        case RuleActionTypes.TRANSITION:
            console.log("RuleActionTypes.TRANSITION");

            /*
            * Azione che si occupa di gestire la transizione, se la transizione ha un video associato avvia la transizione
            * avvia la transizione solo dopo aver riprodotto il video
            */
            let objectVideo_transition = 0;
            let duration_transition = 0;
            let duration = (current_object && current_object.properties.duration) ? parseInt(current_object.properties.duration) : 0;
            let direction = (current_object && current_object.properties.direction) ? current_object.properties.direction : 'nothing';
            //let duration = 0;
            //Se devo cambiare lo sguardo aggiungo 400 ms per dare il tempo alla camera di girare
            if (current_object) {
                if (current_object.properties.duration && current_object.type === 'POINT_OF_INTEREST')
                    duration = parseInt(current_object.properties.duration) + 400;
                else
                    duration = parseInt(current_object.properties.duration);
            }
            //se la transizione ha solo il fade-in e fade-out la direzione resta nothing, altrimenti verrà cambiata con quella scelta dall'utente
            //let direction = 'nothing';
            if (current_object && current_object.properties.duration)
                direction = current_object.properties.direction;
            cursor.setAttribute('material', 'visible: false');
            cursor.setAttribute('raycaster', 'far: 0.1');

            //Se la transizione ha un video associato lo riproduco e salvo la durata
            if(current_object===undefined){//se non lo dovessi trovare
                // current_object in questo caso è la transizione, in una regola generalmente è
                // nella parte dell'oggetto dell'event (quando il giocatore clicca la transizione)
                current_object = game_graph['objects'].get(rule.event.obj_uuid); // lo cerco con lo store
            }
            if (current_object && current_object.type === 'TRANSITION') {
                objectVideo_transition = document.querySelector('#media_' + current_object.uuid);
                if (objectVideo_transition != null && objectVideo_transition.nodeName === 'VIDEO') {
                    objectVideo_transition.play();
                    duration_transition = (parseInt(objectVideo_transition.duration) * 1000); //una volta che il video finisce (durata del media)
                }
            }

            //Se la transizione ha un audio associato lo eseguo
            /*let audioTransition = current_object.audio.audio0;
            if(soundsHub['audio0_' + audioTransition])
                soundsHub['audio0_' + audioTransition].play();*/
            let audioTransition;
            if (current_object) {
                audioTransition = current_object.audio.audio0;
                if (soundsHub['audio0_' + audioTransition])
                    soundsHub['audio0_' + audioTransition].play();
            }

            // se la musica di sottofondo o un altro audio tra due scene è la stesso allora non smette di riprodurlo, altrimenti
            // il primo finisce e parte l'altro
            setTimeout(function () {
                //Set di controlli per la cotinuita' dei file audio, musica di sottofondo, effetti audio di sottofondo, audio integrato del video
                //Cambio musica di sottofondo da una scena ad un'altra
                if ((soundsHub['audios_' + VRScene.state.activeScene.music] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music] &&
                    (soundsHub['audios_' + VRScene.state.activeScene.music] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.music] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].music] === undefined)) {
                    soundsHub['audios_' + VRScene.state.activeScene.music].pause()
                    soundsHub['audios_' + VRScene.state.activeScene.music].currentTime = 0;
                }

                //Cambio effetti di sottofondo da una scena ad un'altra
                if ((soundsHub['audios_' + VRScene.state.activeScene.sfx] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx] &&
                    (soundsHub['audios_' + VRScene.state.activeScene.sfx] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.sfx] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].sfx] === undefined)) {
                    soundsHub['audios_' + VRScene.state.activeScene.sfx].pause()
                    soundsHub['audios_' + VRScene.state.activeScene.sfx].currentTime = 0;
                }

                //Cambio audio scena
                if ((soundsHub['audios_' + VRScene.state.activeScene.uuid] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid] &&
                    (soundsHub['audios_' + VRScene.state.activeScene.uuid] !== soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid])) ||
                    (soundsHub['audios_' + VRScene.state.activeScene.uuid] && soundsHub['audios_' + state.graph.scenes[action_obj_uuid].uuid] === undefined)) {
                    soundsHub['audios_' + VRScene.state.activeScene.uuid].pause();
                    soundsHub['audios_' + VRScene.state.activeScene.uuid].currentTime = 0;
                }

                //cambio audio scena spaziale
                let audioSpatialActiveScene = VRScene.state.activeScene.audios;
                for(var i =0; i<audioSpatialActiveScene.length;i++){
                    let audioSpatial =  VRScene.state.activeScene.audios[i];
                    if(VRScene.state.audios[audioSpatial].isSpatial ){
                        if (soundsHub['audios_' + audioSpatial]) {
                            soundsHub['audios_' + audioSpatial].pause();
                            soundsHub['audios_' + audioSpatial].currentTime = 0;
                        }
                    }
                }

                // se la scena di destinazione e di arrivo sono dello stesso tipo (2D e 2D es.) lancia una transizione normale,
                // se sono di tipo diverso invece lancia la transizione 2D
                if (objectVideo_transition !== 0 && objectVideo_transition !== null &&
                    (store_utils.getFileType(objectVideo_transition.img) === 'video')) objectVideo_transition.pause();
                // se le due scene sono dello stesso tipo le gestisco allo stesso modo
                // effettivo cambio di scena
                if (VRScene.state.activeScene.type === Values.THREE_DIM && state.graph.scenes[action_obj_uuid].type === Values.THREE_DIM ||
                    VRScene.state.activeScene.type === Values.TWO_DIM && state.graph.scenes[action_obj_uuid].type === Values.TWO_DIM)
                    transition(state.activeScene, state.graph.scenes[action_obj_uuid], duration, direction);
                else
                    transition2D(state.activeScene, state.graph.scenes[action_obj_uuid], duration, VRScene)

            }, duration_transition);

            break;
        case RuleActionTypes.CHANGE_STATE:
            console.log("RuleActionTypes.CHANGE_STATE", "rule.actions.obj_uuid", rule.actions.obj_uuid, "game graph: ",
                game_graph['objects'], "subj action:" , sceneName);

            current_object = game_graph['objects'].get(action.subj_uuid);
            /*
            * Azione che si occupa di gestire il cambio di stato dei vari oggetti, vengono richiamate le funzioni
            * corrispondenti a seconda dell'oggetto coinvolto, per chiavi e luchetti la funzione e' la stessa,
            * lo switch ha una funzione sua*/
            switch (action.obj_uuid) {
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
            console.log("RuleActionTypes.ON");

            /*
            * Azione che si occupe del cambio stato utilizzando la regola 'accendi'
            */

            //Verifico se lo stato e' spento, se no non faccio nulla
            if (runState[current_object.uuid].state === "OFF") {
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_' + current_object.uuid);

                //Controllo se l'interrutto ha un vedio associato, se si calcolo la durata del video, poi disattivo il mouse
                if (switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if (store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
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
                }, duration_switch);

            }
            break;
        case RuleActionTypes.OFF:
            console.log("RuleActionTypes.OFF");

            /*
            * Azione che si occupe del cambio stato utilizzando la regola 'spegni'
            */
            if (runState[current_object.uuid].state === "ON") {
                let duration_switch = 0;
                let switchVideo = document.getElementById('media_' + current_object.uuid);

                //Controllo se l'interrutto ha un vedio associato, se si calcolo la durata del video, poi disattivo il mouse
                if (switchVideo != null) {
                    cursor.setAttribute('material', 'visible: false');
                    cursor.setAttribute('raycaster', 'far: 0.1');
                    if (store_utils.getFileType(current_object.img) === 'video') switchVideo.play();
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
                }, duration_switch);

            }
            break;
        case RuleActionTypes.CHANGE_BACKGROUND:
            console.log("RuleActionTypes.CHANGE_BACKGROUND");
            /*
            * Azione che si occupa di effettuare un cambio sfondo della scena
            */
            let targetSceneVideo = document.getElementById(action_obj_uuid);
            //console.log(targetSceneVideo);
            //let primitive = targetSceneVideo.nodeName === 'VIDEO'?"a-videosphere":"a-sky";
            //let actualSky = document.querySelector('#' + actual_scene);
            //actualSky.setAttribute('primitive', primitive)

            if (soundsHub["audios_" + actual_scene_Uuid]) {
                soundsHub["audios_" + actual_scene_Uuid].pause();
                let audioVideo = {};
                audioVideo.file = action_obj_uuid;
                audioVideo.loop = soundsHub["audios_" + actual_scene_Uuid].loop;
                audioVideo.volume = 80;
                soundsHub["audios_" + actual_scene_Uuid] = AudioManager.generateAudio(audioVideo, [0, 0, 0]);
                soundsHub["audios_" + actual_scene_Uuid].play()
            }
            //Se il nuovo sfondo e' un video lo mando in riproduzione
            if (targetSceneVideo.nodeName === 'VIDEO') {
                targetSceneVideo.play();
            }
            //Segnalo allo shader che deve aggiornarsi e poi aggiorno lo stato di VRScene
            document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
            //console.log(runState[sceneName].background);
            runState[sceneName].background = action_obj_uuid;
            //console.log(runState[sceneName].background);
            VRScene.setState({runState: runState, game_graph: game_graph});
            break;
        case RuleActionTypes.PLAY:
            console.log("RuleActionTypes.PLAY");

            /*
            * Azione che si occupa di riprodurre un video o audio, nel caso sia un video ha la sola funziona di cambiare lo
            * stato interno della'attributo loop, se si tratta di un audio cambia lo stato di loop e riprodutce un audio
            * */

            //Controllo se si tratta di un video o un audio
            if (soundsHub["audios_" + action_obj_uuid]) {
                soundsHub["audios_" + action_obj_uuid].loop = false;
                soundsHub["audios_" + action_obj_uuid].play();
            } else {
                if (document.getElementById(actual_scene_img) !== null) {
                    let actualVideoLoop = document.getElementById(actual_scene_img);
                    if (actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = false;
                        //document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true
                    }
                    //VRScene.setState({runState: runState, game_graph: game_graph});
                }
            }
            break;
        case RuleActionTypes.PLAY_LOOP:
            console.log("RuleActionTypes.PLAY_LOOP");


            /*
            * Azione che si occupa di riprodurre un video o audio, nel caso sia un video ha la sola funziona di cambiare lo
            * stato interno della'attributo loop, se si tratta di un audio cambia lo stato di loop e riprodutce un audio
            * */
            if (soundsHub["audios_" + action_obj_uuid]) {
                soundsHub["audios_" + action_obj_uuid].loop = true;
                soundsHub["audios_" + action_obj_uuid].play();
            } else {
                if (document.getElementById(actual_scene_img) !== null) {
                    let actualVideoLoop = document.getElementById(actual_scene_img);
                    if (actualVideoLoop.nodeName === 'VIDEO') {
                        actualVideoLoop.loop = true;
                    }
                }
            }
            break;
        case RuleActionTypes.STOP:
            console.log("RuleActionTypes.STOP");

            /*
            * Azione che si occupa di fermare la riproduzione di oggetti audio
            */

            if (soundsHub["audios_" + action_obj_uuid] && document.querySelector('media_' + action_obj_uuid) === null)
                soundsHub["audios_" + action_obj_uuid].stop();
            break;
        case RuleActionTypes.COLLECT_KEY:
            console.log("RuleActionTypes.COLLECT_KEY");
            current_object = game_graph['objects'].get(action.obj_uuid);


            /*
            * Azione che si occupa di raccogliere una chiave, il giocatore raccoglie la chiave: la chiave è sempre
            * l'oggetto di actions
            */
            changeStateObject(VRScene, runState, game_graph, 'COLLECTED', current_object, action.obj_uuid);
            //TODO: fare in modo che la geometria della chiave sparisca o non sia comunque cliccabile
            break;
        case RuleActionTypes.UNLOCK_LOCK:
            console.log("RuleActionTypes.UNLOCK_LOCK");

            /*
            * Azione che si occupa di aprire un lucchetto
            */
            changeStateObject(VRScene, runState, game_graph, 'UNLOCKED', current_object, action.obj_uuid);
            break;
        case RuleActionTypes.CHANGE_VISIBILITY:
            console.log("RuleActionTypes.CHANGE_VISIBILITY");

            /*
            * Azione che si occupa di cambiare la visibilita', intesa come interagibilita' del cursore su un oggetto
            */
            let obj = document.querySelector('#curv' + action.subj_uuid);
            if (obj) {
                obj.setAttribute('selectable', {visible: action.obj_uuid});
            }

            //il soggetto della frase sarà quello che cambierà visibilità
            runState[action.subj_uuid].visible = action.obj_uuid;
            VRScene.setState({runState: runState, graph: game_graph});
            //ci sono tutta una serie di oggetti UI che cambiano visibilità modificando non solo il cursore
            // ma venendo anche nascosti
            let bool = action_obj_uuid === 'VISIBLE'; //true se è visibile, false altrimenti
            switch(subject_obj.type){
                case InteractiveObjectsTypes.TEXTBOX:
                    create_scene2.textboxChangeVisibility(actual_scene_name, bool);
                    break;
                case InteractiveObjectsTypes.TIMER:
                    create_scene2.timerChangeVisibility(actual_scene_name, bool);
                    break;
                case InteractiveObjectsTypes.HEALTH:
                    create_scene2.healthChangeVisibility(actual_scene_name, bool);
                    break;
                case InteractiveObjectsTypes.SCORE:
                    create_scene2.scoreChangeVisibility(actual_scene_name, bool);
                    break;
                case InteractiveObjectsTypes.PLAYTIME:
                    create_scene2.playTimeChangeVisibility(actual_scene_name, bool);
                    break;
            }

            break;
        case RuleActionTypes.CHANGE_ACTIVABILITY:
            console.log("RuleActionTypes.CHANGE_ACTIVABILITY");

            let obj_act = document.querySelector('#curv' + action.subj_uuid); //oggetto che si sta attivando o disattivando
            //qua c'è l'effettiva disattivazione o attivazione dell'oggetto
            if (obj_act) {
                obj_act.setAttribute('selectable', {activable: action.obj_uuid});
            }

            //da qua in poi il codice si concentra sul come far apparire il cursore a seconda dell'elemento sopra cui si trova
            if (action.subj_uuid.activable === 'ACTIVABLE') { //lo stato iniziale è attivabile
                if (cursor) {
                    cursor.setAttribute('color', 'black');
                    if (action.subj_uuid.type === 'TRANSITION') { //è transizione
                        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                    } else { //non è transizione
                        cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.001; to:0.01;');
                    }
                }
            } else { //sono sopra un oggetto non attivabile
                cursor.setAttribute('color', 'black');
                if (action.subj_uuid.type === 'TRANSITION') { //è transizione
                    cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
                } else { //non è transizione
                    //in questo caso l'oggetto deve diventare attivabile, quindi il cursore sarà verde
                    cursor.setAttribute('color', 'green');
                    cursor.setAttribute('animation__circlefill', 'property: geometry.radiusInner; dur:200; from:0.01; to:0.001;');
                }
            }

            runState[action.subj_uuid].activable = action.obj_uuid;
            VRScene.setState({runState: runState, graph: game_graph});
            break;
        case RuleActionTypes.LOOK_AT:
            console.log("RuleActionTypes.LOOK_AT");

            /*
            * Azione che si occupa di girare la camera verso un punto ben preciso impostato dall'utente
            */
            let delay = game_graph['objects'].get(action.obj_uuid).properties.delay;
            setTimeout(function () {
                //TODO: sarebbe opportuno controllare che la scena di destinazione sia 3D
                let pointOI = game_graph['objects'].get(action.obj_uuid);
                lookObject('curv' + action.obj_uuid, pointOI.vertices);
            }, delay)

            break;
        case RuleActionTypes.DECREASE_STEP:
            console.log("RuleActionTypes.DECREASE_STEP");

            /*
            * Azione che si occupa di decrementare  il valore del contattore, di uno step
            */
            if (runState[action.subj_uuid].state > 0) {
                runState[action.subj_uuid].state = parseInt(runState[action.subj_uuid].state);
                runState[action.subj_uuid].state -= parseInt(game_graph['objects'].get(action.subj_uuid).properties.step);
            }

            VRScene.setState({runState: runState, graph: game_graph});
            eventBus.emit(`${action.subj_uuid}-reach_counter-${runState[action.subj_uuid].state}`);
            break;
        case RuleActionTypes.INCREASE_STEP:
            console.log("RuleActionTypes.INCREASE_STEP");

            /*
            * Azione che si occupa di incrementare  il valore del contattore, di uno step
            */
            runState[action.subj_uuid].state = parseInt(runState[action.subj_uuid].state);
            runState[action.subj_uuid].state += parseInt(game_graph['objects'].get(action.subj_uuid).properties.step);
            VRScene.setState({runState: runState, graph: game_graph});
            let myevent = `${action.subj_uuid}-reach_counter-${runState[action.subj_uuid].state}`
            eventBus.emit(myevent);
            break;
        case RuleActionTypes.INCREASE:
            console.log("RuleActionTypes.INCREASE", sceneName, "type: ", sceneName.type);

            /*
            * Azione che si occupa di assegnare un valore scelto dall'untente, al contatore,
            * alla vita, al punteggio o al tempo di gioco
            */
            let numberValue =parseInt(action.obj_uuid);
            switch (subject_obj.type) {
                case InteractiveObjectsTypes.COUNTER:
                    runState[action.subj_uuid].state = numberValue;
                    VRScene.setState({runState: runState, graph: game_graph});
                    eventBus.emit(`${rule.event.subj_uuid}-reach_counter-${numberValue}`);
                    break;
                case InteractiveObjectsTypes.HEALTH:
                    create_scene2.changeHealthValue(numberValue, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.FLAG:
                    create_scene2.changeFlagValue(numberValue, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.NUMBER:
                    create_scene2.changeNumberValue(numberValue, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.SCORE:
                    create_scene2.changeScoreValue(numberValue, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.PLAYTIME:
                    create_scene2.changePlaytimeValue(numberValue, actual_scene_name);
                    break;
            }
            break;
        case RuleActionTypes.TRIGGERS:
            /*
                Azione che si occupa di avviare una regola o un timer
             */
            if (RulesStore.getState().get(action_obj_uuid) !== undefined) {//sto triggerando una regola regola?
                let objectVideo = document.querySelector('#media_' + rule.event.obj_uuid);
                if(!objectVideo){
                    objectVideo = document.querySelector('#media0_' + rule.event.obj_uuid);
                }
                let newRule = RulesStore.getState().get(action_obj_uuid);
                if(!objectVideo){
                    eventBus.emit(`${newRule.event.subj_uuid}-${newRule.event.action.toLowerCase()}-${newRule.event.obj_uuid}`); //Solo per regole
                }else{
                    setTimeout(function(){
                        eventBus.emit(`${newRule.event.subj_uuid}-${newRule.event.action.toLowerCase()}-${newRule.event.obj_uuid}`);
                    }, objectVideo.duration * 1000)
                }

            } else { //sto triggerando un timer
                create_scene2.timerStart();
            }
            break;
        case RuleActionTypes.STOP_TIMER:
            create_scene2.timerStop();
            break;
        case RuleActionTypes.REACH_TIMER:
            let time = parseInt(action.obj_uuid);
            create_scene2.changeTimerTime(time);
            break;
        case RuleActionTypes.INCREASE_NUMBER:
            let numberVal =parseInt(action.obj_uuid); //di quanto aumenta
            switch (subject_obj.type) {
                case InteractiveObjectsTypes.SCORE:
                    create_scene2.increaseScoreValue(numberVal, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.HEALTH:
                    create_scene2.increaseHealthValue(numberVal, actual_scene_name);
                    break;
            }
            break;
        case RuleActionTypes.DECREASE_NUMBER:
            let numberVale =parseInt(action.obj_uuid); //di quanto aumenta
            switch (subject_obj.type) {
                case InteractiveObjectsTypes.SCORE:
                    create_scene2.decreaseScoreValue(numberVale, actual_scene_name);
                    break;
                case InteractiveObjectsTypes.HEALTH:
                    create_scene2.decreaseHealthValue(numberVale, actual_scene_name);
                    break;
            }
            break;
        case RuleActionTypes.PROGRESS:
            console.log("progress selector");
            create_scene2.nextSelectorState(VRScene, runState, game_graph, subject_obj, actual_scene_name);
            break;
        case "UPDATE_KEYPAD":
            /*non è un Action Types perchè non è un'azione vera e propria che si vede nelle regole
            è implicita quando si genera una regola con "se il codice è corretto" e verifica in game
            quali tasti l'utente ha cliccato*/
            let uuid_btn_pressed = action_obj_uuid; //uuid btn premuto
            let keypad = subject_obj; //tastierino di riferimento
            let btn_value = keypad.properties.buttonsValues[uuid_btn_pressed]; //valore associato al btn premuto
            create_scene2.updateKeypadValue(btn_value, keypad.uuid); //aggiorno il valore del tastierino
            current_object = game_graph['objects'].get(uuid_btn_pressed);

            break;
        case "CHECK_KEYPAD":
            current_object = game_graph['objects'].get(rule.event.obj_uuid);
            changeStateSwitch(VRScene, runState, current_object, cursor, action);
            break;

        case RuleActionTypes.INSERT: //aggiunge alla combinazione
            //subject_object: il tastierino
            current_object = action.obj_uuid; //valore da inserire
            create_scene2.updateKeypadValue(current_object, action.subj_uuid); //aggiorno il valore del tastierino
            // alza l'evento che il keypad è arrivato alla lunghezza n
            let length = window.keypadValue[subject_obj.uuid].length;

            let event = `${subject_obj.uuid}-reach_keypad-${length}`;
            console.log(`emit`, event);
            eventBus.emit(event);
            return;

        default:
            console.log('not yet implemented');
            console.log(action);


    }
    let event=null;
    //tempo di gioco
    if(subject_obj &&subject_obj.type === InteractiveObjectsTypes.PLAYTIME){
        event = `GameTime-reach_minute-${action.obj_uuid}`;
    }
    //vita
    else if( subject_obj &&subject_obj.type=== InteractiveObjectsTypes.HEALTH){
        event = `Health-value_changed_to-${action.obj_uuid}`;
    }
    //punteggio
    else if(subject_obj && subject_obj.type === InteractiveObjectsTypes.SCORE){
        event = `Score-value_changed_to-${action.obj_uuid}`;
    }
    else{
        event = `${action.subj_uuid}-${action.action.toLowerCase()}-${action.obj_uuid}`;
    }
    console.log(`emit`, event);
    eventBus.emit(event);
}

/**
 * Function that manages the transitions
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition(actualScene, targetScene, duration, direction) {
    let actualSky = document.querySelector('#' + actualScene.name);
    let actualSceneVideo = document.getElementById(actualScene.img);
    if (store_utils.getFileType(actualScene.img) === 'video' && actualSceneVideo)
        actualSceneVideo.pause(); //se è un video lo pauso
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let actualMove = new CustomEvent(actualSky.id + "actual");
    let targetMove = new CustomEvent(targetSky.id + "target");
    let sceneMovement = true;
    let is3dScene = actualScene.type === Values.THREE_DIM;
    let positionTarget;
    let positionActual;
    let canvasWidth = document.documentElement.clientWidth / 100;
    let canvasHeight = document.documentElement.clientHeight;
    //se ha una direzione imposta la posizione di conseguenza
    switch (direction) {
        case 'RIGHT':
            positionTarget = canvasWidth + ', 1.6, -6';
            positionActual = -canvasWidth + ', 1.6, -6';
            break;
        case 'LEFT':
            positionTarget = -canvasWidth + ', 1.6, -6';
            positionActual = canvasWidth + ', 1.6, -6';
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
            sceneMovement = false;
            break;
    }
    // se è 2D non sono al centro e posiziono il target
    if (targetScene.type === Values.TWO_DIM)
        targetSky.setAttribute('position', positionTarget);

    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");
    //TODO impostare uno dei valori da editor a nessuno o una direzione, differenziare anceh se
    // sono scene 3D o 2D, nel 3D non vogliamo questo effetto, credo
    if (sceneMovement && !is3dScene) {
        actualSky.setAttribute('animation__moving', 'property: position; dur: ' + duration +
            '; easing: linear; from: 0 1.6 -6; ' +
            'to: ' + positionActual + '; startEvents: ' + actualSky.id + "actual")
        targetSky.setAttribute('animation__moving', 'property: position; dur: ' + duration +
            '; easing: linear; from: ' + positionTarget + '; ' +
            'to: 0 1.6 -6; startEvents: ' + targetSky.id + "target")
    }
    actualSky.setAttribute('material', 'depthTest: false');
    targetSky.setAttribute('material', 'depthTest: false');

    targetSky.setAttribute('visible', 'true');
    targetSky.setAttribute('material', 'visible: true');
    actualSky.dispatchEvent(disappear);

    //[Vittoria] ho un timeout anche in caso di scene da 2D->2D, c'è una sorta di effetto di fade
    setTimeout(function () {
            targetSky.dispatchEvent(appear);
        }
        , parseInt(duration)
    );

    /* Se non si vuole il fade decommentare qui
        if(is3dScene){
        setTimeout(function () {
                targetSky.dispatchEvent(appear);}
            , parseInt(duration)
        );
        } else {
         targetSky.dispatchEvent(appear);
    }*/

    //targetSky.dispatchEvent(appear);

    if (sceneMovement && !is3dScene) {
        actualSky.dispatchEvent(actualMove);
        targetSky.dispatchEvent(targetMove);
    }
    setTimeout(function () {
            if (store_utils.getFileType(targetScene.img) === 'video') {
                targetSceneVideo.currentTime = 0;
                targetSceneVideo.play();
            }
        }
        , parseInt(duration) + 100
    );

    eventBus.emit("PLAYER-enter_scene-"+ targetScene.uuid);
    //if(store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
}

/**
 * Function called only in transioto between diferent type of scene, 3D -> 2D or 2D -> 3D
 * @param actualScene
 * @param targetScene
 * @param duration
 */
function transition2D(actualScene, targetScene, duration) {
    console.log("FUNCTION TRANSITION2D");

    let camera = document.getElementById('camera');
    let cursor = document.getElementById('cursor');
    let actualSky = document.querySelector('#' + actualScene.name); //[Vittoria] oggetto di aframe sky
    let actualSceneVideo = document.getElementById(actualScene.img);
    let targetSky = document.querySelector('#' + targetScene.name);
    let targetSceneVideo = document.getElementById(targetScene.img);
    let is3dScene = actualScene.type === Values.THREE_DIM;
    // se è una scena 3D a muoversi sarà la scena di arrivo (2D), altrimenti a muoversi sarà la scena dove siamo (2D)
    let sceneMovement = is3dScene ? targetSky : actualSky;
    // custom events per la posizione della bolla
    let disappear = new CustomEvent(actualSky.id + "dis");
    let appear = new CustomEvent(targetSky.id + "app");
    let movement = new CustomEvent(sceneMovement.id + "move");

    // attributi per sparire (actualsky) e apparire (targetSky)
    actualSky.setAttribute('animation__disappear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 1; to: 0; startEvents: ' + actualSky.id + "dis");
    targetSky.setAttribute('animation__appear', 'property: material.opacity; dur: ' + duration +
        '; easing: linear; from: 0; to: 1; startEvents: ' + targetSky.id + "app");

    if (is3dScene) {
        sceneMovement.setAttribute('animation__moving', 'property: position; dur: ' + duration +
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

    if (store_utils.getFileType(actualScene.img) === 'video')
        actualSceneVideo.pause(); // se la scena attuale è un video lo metto in pausa
    actualSky.dispatchEvent(disappear);
    if (!is3dScene) {
        sceneMovement.dispatchEvent(movement);
    }
    eventBus.emit("PLAYER-enter_scene-"+ targetScene.uuid);

    setTimeout(function () {
        if(targetScene.type === Values.TWO_DIM){
            lookObject(targetSky.id); // serve per rimettere al suo posto il cursore passando da una scena 3D a 2D
        }
        targetSky.dispatchEvent(appear);
        sceneMovement.dispatchEvent(movement);
        if (store_utils.getFileType(targetScene.img) === 'video') targetSceneVideo.play();
    }, duration);

}

/*
    Se gli passo un oggetto guardo quello, altrimenti posso passare un punto di interesse e guarda quello
 */
function lookObject(idObject, pointOI = null) {
    let obj = document.getElementById(idObject);
    let center;
    let l;
    //Cambio di camera
    let camera = document.getElementById('camera');
    let cameraPosition = camera.getAttribute('position');
    let euler = new THREE.Euler();
    let quaternion = new THREE.Quaternion();
    let v = new THREE.Vector3(cameraPosition.x, cameraPosition.y, -10).normalize()
    if (obj !== null) {
        obj.components.geometry.geometry.computeBoundingSphere();
        center = obj.components.geometry.geometry.boundingSphere;
        l = center.center.normalize();
        quaternion.setFromUnitVectors(v, l);
        euler.setFromQuaternion(quaternion, 'YXZ', false);
    }

    if (pointOI === null) {
        //[Vittoria] mi sto riferendo a una transizione tra scene
        camera.setAttribute("pac-look-controls", "planarScene: true");
        camera.setAttribute("pac-look-controls", "pointerLockEnabled: false");
    } else {
        let points = pointOI.split(' ').map(function (x) {
            return parseFloat(x);
        });
        let p = new THREE.Vector3(points[0], points[1], points[2]);
        let correction = new THREE.Euler(0,   Math.PI / 2, 0, 'YXZ');
        p.applyEuler(correction);
        l = p.normalize();
        quaternion.setFromUnitVectors(v, l);
        euler.setFromQuaternion(quaternion, 'YXZ', false);
    }
    //[Vittoria] spostamenti della camera
    camera.components["pac-look-controls"].yawObject.rotation._y = euler._y;
    camera.components["pac-look-controls"].yawObject.rotation._x = 0;
    camera.components["pac-look-controls"].yawObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._x = euler._x;
    camera.components["pac-look-controls"].pitchObject.rotation._z = 0;
    camera.components["pac-look-controls"].pitchObject.rotation._y = 0;
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
 * Cambio stato oggetti (chiavi e lucchetti) relativi alle regole
 */
function changeStateObject(VRScene, runState, game_graph, state, current_object, action_uuid) {
    console.log("FUNCTION CHANGESTATEOBJECT \n", "current object: ", current_object, "action uuid: ", action_uuid);

    runState[action_uuid].state = state;

    if(current_object===undefined){
        current_object = game_graph['objects'].get(action_uuid);
    }

    let audioKey = current_object.audio.audio0;
    if (soundsHub['audio0_' + audioKey])
        soundsHub['audio0_' + audioKey].play();
    // Quando una chiave viene raccolta o un lucchetto viene aperto sparisce e non è più attivabile nè visibile,
    // prima l'oggetto veniva filtrato ed eliminato
    runState[current_object.uuid].visible = false;
    runState[current_object.uuid].activable = false;

    //se la chiave ha un video associato al media lo devo eseguire
    let objectVideo, duration_video;
    //credo che per le chiavi le salvi così
    objectVideo = document.querySelector('#media_' + current_object.uuid);
    // e per i lucchetti così, ma non ne sono sicurissima
    if(objectVideo===null){
        objectVideo = document.querySelector('#media0_' + current_object.uuid);
    }

    //la chiave collezionata
    if (current_object && (state === 'COLLECTED' || state === 'UNLOCKED')) {
        if (objectVideo != null && objectVideo.nodeName === 'VIDEO') {
            duration_video = (parseFloat(objectVideo.duration)*1000 ); //una volta che il video finisce (durata del media)
            objectVideo.play();

            setTimeout(function () {
                //dovrò eseguire questo solo dopo che ho finito il play, altrimenti l'animazione non si vede
                document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
                //[Vittoria] per qualche motivo i lucchetti li devo mettere in pausa altrimenti vanno in loop
                if(state === 'UNLOCKED'){
                    objectVideo.pause()
                }
            }, duration_video);

        }
    }
    //TODO: qua potrebbe essere utile cancellare la geometria della chiave
    //se è un video lo faccio prima
    if (current_object.media.media0 !== null && objectVideo.nodeName !== 'VIDEO') {
        document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;
    }

    VRScene.setState({runState: runState, graph: game_graph});
}

//TODO: funzione per far partire il media di un pulsante, da finire
export function buttonMedia( current_object, cursor){
    let duration_switch = 0;
    //media da caricare: se sto passando al media OFF allora prendo media0, altrimenti media 1
    let media = current_object.media.media0;
    let mediaObject =  document.getElementById( 'media0'+ '_' + current_object.uuid);

    if(mediaObject!= null){
        cursor.setAttribute('material', 'visible: false');
        cursor.setAttribute('raycaster', 'far: 0.1');

        if (store_utils.getFileType(media) === 'video') {
            mediaObject.loop = false;
            mediaObject.currentTime = 0;
            mediaObject.play();
        }
        /*questa durata è quella che ritarda la partenza di un eventuale media video
        servirebbe a non far fare altro al giocatore mentre è in play, ma per ora lo lasciamo così*/
        //duration_switch = (parseInt(mediaObject.duration) * 1000);
        duration_switch = (parseInt(mediaObject.duration) * 1000);
    }

    //TODO controlla audio
    let audio = current_object.audio.audio0;
    let idAudio = 'audio0_';
    if (soundsHub[idAudio + audio])
        soundsHub[idAudio + audio].play();

    setTimeout(function () {
        cursor.setAttribute('raycaster', 'far: 10000');
        cursor.setAttribute('material', 'visible: true');
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        cursor.setAttribute('color', 'black');

        //Qui faccio tornare il media al primo frame
        mediaObject.pause();
        mediaObject.currentTime = 0;
    }, duration_switch)
}

/*
    Cambio stato per l'oggetto Switch
 */
function changeStateSwitch(VRScene, runState, current_object, cursor, action) {
    let id = window.localStorage.getItem("gameID");
    let duration_switch = 0;

    let prevState = current_object.properties.state; //ON o OFF
    let newState = action.obj_uuid; //ON o OFF

    //Cambio lo stato dello switch
    current_object.properties.state = newState;

    //media da caricare: se sto passando al media OFF allora prendo media0, altrimenti media 1
    let media = newState === 'OFF' ? current_object.media.media0 : current_object.media.media1;

    let indexMedia = newState === 'OFF' ? 0 : 1; //media0 o media1

    let mediaObject =  document.getElementById( 'media'+ indexMedia+ '_' + current_object.uuid);

    if(mediaObject!= null){
        cursor.setAttribute('material', 'visible: false');
        cursor.setAttribute('raycaster', 'far: 0.1');

        if (store_utils.getFileType(media) === 'video') {
            mediaObject.loop = false;
            mediaObject.currentTime = 0;
            mediaObject.play();
        }
        /*questa durata è quella che ritarda la partenza di un eventuale media video
        servirebbe a non far fare altro al giocatore mentre è in play, ma per ora lo lasciamo così*/
        //duration_switch = (parseInt(mediaObject.duration) * 1000);
        duration_switch = (parseInt(mediaObject.duration) * 1);
    }

    //TODO controlla audio
    let audio = current_object.properties.state === 'ON' ? current_object.audio.audio0 : current_object.audio.audio1;
    let idAudio = current_object.properties.state === 'ON' ? 'audio0_' : 'audio1_';
    if (soundsHub[idAudio + audio])
        soundsHub[idAudio + audio].play();


    setTimeout(function () {
        cursor.setAttribute('raycaster', 'far: 10000');
        cursor.setAttribute('material', 'visible: true');
        cursor.setAttribute('animation__circlelarge', 'property: scale; dur:200; from:2 2 2; to:1 1 1;');
        cursor.setAttribute('color', 'black');

        //l'oggetto cambia stato e aggiorno lo shader
        document.getElementById(VRScene.state.activeScene.name).needShaderUpdate = true;

        if(action.action == "CHECK_KEYPAD")
        {
            runState[action.obj_uuid].state = newState;
        }else{
            runState[action.subj_uuid].state = newState;
        }
        VRScene.setState({runState: runState});

    }, duration_switch)
}

/*function nextSelectorState (runState, game_graph, selectorObj, activeSceneName){ //da chiamare al click del selettore
    window.selectorState+=1;
    if(window.selectorState>selectorObj.properties.optionsNumber)
        window.selectorState=1; //il primo stato è 1
    console.log("Nuovo stato del selettore:", window.selectorState)

    document.getElementById(activeSceneName).needShaderUpdate = true;

    VRScene.setState({runState: runState, graph: game_graph});

    console.log(selectorObj)
}*/



export {
    executeAction,
    lookObject
}