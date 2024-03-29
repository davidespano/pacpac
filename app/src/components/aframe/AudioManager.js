/**
 * Funzione che si occupa di generare un audio utilizzando Resonance audio
 */
import {ResonanceAudio} from "resonance-audio";
import settings from "../../utils/settings";
const {mediaURL} = settings;
const resonanceee = require('./Audio/Resonance');
//[Vittoria] per vedere cosa succede qua nell'editor vai in un oggetto e crea un oggetto Audio

function generateAudio(audio, position=null, volume, uuidGame=null) {
    let audioPosition = position===null?audio.vertices:position;
    let audioElement = document.createElement('audio');

    if(uuidGame){ //nei giochi pubblicati altrimenti sbaglia la url
        audioElement.src = `${mediaURL}${uuidGame}/` + audio.file;
    }
    else {
        audioElement.src = `${mediaURL}${window.localStorage.getItem("gameID")}/` + audio.file;
    }
    console.log("src: ", audioElement.src)
    audioElement.crossOrigin = 'anonymous';
    audioElement.load();
    audioElement.loop = audio.loop;

    let audioElementSource = resonanceee.default._context.createMediaElementSource(audioElement);
    let source = resonanceee.default.createSource();
    audioElementSource.connect(source.input);
    if (Array.isArray(audioPosition)){
        source.setPosition(audioPosition[0], audioPosition[1],audioPosition[2]);
    }
    else
    {
        source.setPosition(audioPosition);
    }
    if(volume == undefined)
        volume=audio.volume
    source.setGain(parseInt(volume)/100)

    return audioElement;
}

export default {
    generateAudio : generateAudio,
}