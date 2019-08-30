import {ResonanceAudio} from "resonance-audio";

let audioContext = new AudioContext();

let isInterior = false;
let material = isInterior ? 'grass' : 'transparent';

const resonance = new ResonanceAudio(audioContext);
resonance.output.connect(audioContext.destination);
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

resonance.setRoomProperties(roomDimensions, roomMaterials);

//const resonance = resonanceAudioScene;

export default resonance;