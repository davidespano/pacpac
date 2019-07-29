import {ResonanceAudio} from "resonance-audio";
import settings from "../../utils/settings";
const {mediaURL} = settings;

function generateAudio(audio, resonance, audioContext, position=null) {
    let audioPosition = position===null?audio.vertices:position;
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

export default {
    generateAudio : generateAudio,
}