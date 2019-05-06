import {ResonanceAudio} from "resonance-audio";

function generateAudio(srcId, position) {
    let audioContext = new AudioContext();
    //TODO verificare che i parametri passati come array funzionino
    let audioPosition = position!=null?position:[0,0,0];
    let audio = {};
    setTimeout(() => {
        audio=document.getElementById(srcId);
        let audioElementSource = audioContext.createMediaElementSource(audio);
        let source = this.state.resonanceAudioScene.createSource();
        audioElementSource.connect(source.input);
        source.setPosition(audioPosition);
        audio.play();
    },50)
    return audio;
}

export default {
    generateAudio : generateAudio,
}