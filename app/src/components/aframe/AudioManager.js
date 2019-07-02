import {ResonanceAudio} from "resonance-audio";
import settings from "../../utils/settings";
const {mediaURL} = settings;

function generateAudio(audio) {
    let audioContext = new AudioContext();
    //TODO verificare che i parametri passati come array funzionino
    let audioPosition = audio.position!=null?audio.position:[0,0,0];
    let resonance = generateRoom(audioContext);
    //let audio = {};
    //audio=document.getElementById(srcId);
    let audioElement = document.createElement('audio');
    audioElement.src = `${mediaURL}${window.localStorage.getItem("gameID")}/` + audio.file;
    audioElement.crossOrigin = 'anonymous';
    audioElement.load();
    audioElement.loop = audio.loop;
    let audioElementSource = audioContext.createMediaElementSource(audioElement);
    let source = resonance.createSource();
    audioElementSource.connect(source.input);
    source.setPosition(audioPosition);
    return audioElement;
}

function generateRoom (audioContext) {

    let isInterior = false;
    let material = isInterior ? 'grass' : 'transparent';

    let resonanceAudioScene = new ResonanceAudio(audioContext);
    resonanceAudioScene.output.connect(audioContext.destination);
    let roomDimensions = {
        width: 4,
        height: 4,
        depth: 4,
    };
    let roomMaterials = {
        // Room wall materials
        left: material,
        right: material,
        front: material,
        back: material,
        down: material,
        up: material,
    };

    resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);

    return resonanceAudioScene;
}
export default {
    generateAudio : generateAudio,
}