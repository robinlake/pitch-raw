import { initializePitchDetect } from "./pitch-detect.js";

function initializeControls(audioContext) {
    const pitch = document.getElementById("pitch-detect");
    const detector = document.getElementById("detector");
    if (pitch != null && detector != null) {
        let initialized = false;
        let active = false;
        pitch.addEventListener("click", () => {
            if (!initialized) {
                initializePitchDetect(audioContext);
                initialized = true;
                active = true;
                pitch.innerHTML = "Hide Pitch";
                detector.classList.remove('hidden');
                return;
            }
            if (!active) {
                active = true;
                pitch.innerHTML = "Hide Pitch";
                detector.classList.remove('hidden');
            }
            else {
                active = false;
                pitch.innerHTML = "Show Pitch";
                detector.classList.add('hidden');
            }
        });
    }
}

export {initializeControls}