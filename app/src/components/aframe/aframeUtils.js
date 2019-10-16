//TODO eliminare, non viene piu' utilizzata

import {Howler} from 'howler';

function activePlayAudio(){
    Howler.autoUnlock = false;
}

function addScript(){
    let scripts = [ 'node_modules/resonance-audio/build/resonance-audio.min.js',
                    'https://rawgit.com/ngokevin/kframe/master/components/animation/dist/aframe-animation-component.min.js',
                    'https://cdn.rawgit.com/noahneumark/aframe-resonance-audio/fe37437/components/noah-ra-room.min.js]',
                    'https://cdn.rawgit.com/noahneumark/aframe-resonance-audio/fe37437/components/noah-ra-src.min.js',
                    'https://cdn.rawgit.com/noahneumark/aframe-resonance-audio/fe37437/components/noah-ra-beatsync.min.js'];
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    scripts.forEach(s => function () {
        script.type = 'text/javascript';
        script.src = s;
        head.appendChild(script);
    });

}
export default {
    activePlayAudio : activePlayAudio,
    addScript : addScript
}