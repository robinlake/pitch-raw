import { autoCorrelate } from "./tuner.js";

// console.log(sf(buffer, sampleRate));
// /**
//  * Implements the normalized square difference function. See section 4 (and
//  * the explanation before) in the MPM article. This calculation can be
//  * optimized by using an FFT. The results should remain the same.
//  *
//  * @param audioBuffer
//  *            The buffer with audio information.
//  */
// // Stolen from https://github.com/JorenSix/TarsosDSP/blob/d9583528b9573a97c220d19e6d9ab2929e9bd1c5/src/core/be/tarsos/dsp/pitch/McLeodPitchMethod.java#L179-L197
// function normalizedSquareDifference(nsdf, audioBuffer) {
//   for (let tau = 0; tau < audioBuffer.length; tau++) {
//     let acf = 0;
//     let divisorM = 0;
//     for (let i = 0; i < audioBuffer.length - tau; i++) {
//       const a = audioBuffer[i];
//       const b = audioBuffer[i + tau];
//       acf += a * b;
//       divisorM += a * a + b * b;
//     }
//     nsdf[tau] = (2 * acf) / divisorM;
//   }
// }
var noteStrings = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];
function noteFromPitch(frequency) {
    return Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
}
function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}
function centsOffFromPitch(frequency, note) {
    return Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2));
}
let buflen = 2048;
let buf = new Float32Array(buflen);
let analyser;
let detectorElem = document.querySelector('#detector');
let pitchElem = document.querySelector('#pitch');
let noteElem = document.querySelector('#note');
let detuneElem = document.querySelector('#detune');
let detuneAmount = document.querySelector('#detune_amt');
let ctx;

function initializePitchContext(audioContext) {
    ctx = audioContext;
    detectorElem = document.querySelector('#detector');
    pitchElem = document.querySelector('#pitch');
    noteElem = document.querySelector('#note');
    detuneElem = document.querySelector('#detune');
    detuneAmount = document.querySelector('#detune_amt');
}
function updatePitch(audioContext) {
    requestAnimationFrame(updatePitch);
    analyser.getFloatTimeDomainData(buf);
    const numberBuf = new Array(...buf);
    const ac = autoCorrelate(numberBuf, ctx.sampleRate);
    if (ac === -1 && detectorElem && pitchElem && noteElem && detuneElem && detuneAmount) {
        detectorElem.classList.add('vague');
        detectorElem.classList.remove('confident');
        pitchElem.textContent = '--';
        noteElem.textContent = '-';
        detuneElem.className = '';
        detuneAmount.textContent = '--';
    }
    else {
        const pitch = ac;
        const note = noteFromPitch(pitch);
        const detune = centsOffFromPitch(pitch, note);
        if (detectorElem && pitchElem && noteElem && detuneElem && detuneAmount) {
            detectorElem.classList.add('confident');
            detectorElem.classList.remove('vague');
            pitchElem.textContent = Math.round(pitch).toString();
            noteElem.textContent = noteStrings[note % 12];
            if (detune == 0) {
                detuneElem.className = '';
                detuneAmount.textContent = '--';
            }
            else {
                detuneElem.className = detune < 0 ? 'flat' : 'sharp';
                detuneAmount.textContent = Math.abs(detune).toString();
            }
        }
    }
}
function gotStream(stream, audioContext) {
    // Create an AudioNode from the stream.
    let mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
    // let analyser = audioContext.createAnalyser();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
    updatePitch(audioContext);
}
function initializePitchDetect(audioContext) {
    initializePitchContext(audioContext);
    navigator.mediaDevices
        .getUserMedia({
        audio: true
    })
        .then((stream) => {
            gotStream(stream, audioContext);
            console.log("got stream");
    })
        .catch((err) => {
        console.log(`Error: ${err}`);
        /* handle that error */
    });
}
export { initializePitchDetect };
