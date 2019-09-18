import {ResonanceAudio} from "resonance-audio";
import settings from "../../utils/settings";
const {mediaURL} = settings;
const resonanceee = require('./Audio/Resonance');

function generateAudio(audio, position=null, volume) {
    let audioPosition = position===null?audio.vertices:position;
    let audioElement = document.createElement('audio');

    audioElement.src = `${mediaURL}${window.localStorage.getItem("gameID")}/` + audio.file;
    audioElement.crossOrigin = 'anonymous';
    audioElement.load();
    audioElement.loop = audio.loop;

    let audioElementSource = resonanceee.default._context.createMediaElementSource(audioElement);
    let source = resonanceee.default.createSource();
    audioElementSource.connect(source.input);
    source.setPosition(audioPosition);
    console.log(volume)
    if(volume == undefined)
        volume=audio.volume
    source.setGain(parseInt(volume)/100)

    return audioElement;
}

export default {
    generateAudio : generateAudio,
}