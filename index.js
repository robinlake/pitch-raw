import {volume } from './visualizer.js'
import { initializeControls } from './controls.js'

const context = new AudioContext({sampleRate: 4000})
const analyserNode = new AnalyserNode(context, { fftSize: 128 })
const gainNode = new GainNode(context, { gain: volume.value})

function setupEventListeners() {

  volume.addEventListener('input', e => {
    const value = parseFloat(e.target.value)
    gainNode.gain.setTargetAtTime(value, context.currentTime, .01)
  })
}

async function setupContext() {
  const guitar = await getGuitar()
  if (context.state === 'suspended') {
    await context.resume()
  }
  const source = context.createMediaStreamSource(guitar)
  source
    .connect(gainNode)
    .connect(analyserNode)
    .connect(context.destination)
}

function getGuitar() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0
    }
  })
}


window.onload = function() {
  setupEventListeners();
  setupContext();
  initializeControls();
};