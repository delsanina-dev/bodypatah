const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const cd = document.getElementById("cd");
const cdWrapper = document.getElementById("cd-wrapper");
const notes = document.getElementById("music-notes");
const bars = document.querySelectorAll(".bar");

let audioContext;
let analyser;
let source;
let dataArray;
let animationId;
let noteInterval;

playBtn.addEventListener("click", async () => {

    if (!audioContext) {

        audioContext = new AudioContext();
        source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

    }
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = "⏸ Pause";
        cd.classList.add("spin");
        startVisualizer();
        startNotes();
    } else {
        audio.pause();
    }
});

audio.addEventListener("pause", () => {
    playBtn.innerHTML = "▶ Play";
    cd.classList.remove("spin");
    stopVisualizer();
    stopNotes();
});
audio.addEventListener("ended", () => {
    playBtn.innerHTML = "▶ Play";
    cd.classList.remove("spin");
    stopVisualizer();
    stopNotes();
});
function startVisualizer() {

    function animate() {
    analyser.getByteFrequencyData(dataArray);
    const bass = dataArray[2];
    const scale = 0.5 + bass / 200;
    bars.forEach((bar, index) => {
        const value = dataArray[index];
        const height = Math.max(20, value * 0.6);
        bar.style.transform = `scaleY(${height / 15})`;
    });
    cdWrapper.style.transform = `scale(${scale})`;
    animationId = requestAnimationFrame(animate);}
    animate();
    }

function stopVisualizer() {
    cancelAnimationFrame(animationId);
    bars.forEach(bar => {
        bar.style.height = "10px";
    });
}
function startNotes() {
    noteInterval = setInterval(createNote, 400);
}
function stopNotes() {
    clearInterval(noteInterval);

}
function createNote() {

    const icons = ["asekk","♫","♬","🎵"];
    const note = document.createElement("div");
    note.className = "note";
    note.innerHTML = icons[Math.floor(Math.random()*icons.length)];
    note.style.left = Math.random()*100 + "vw";
    note.style.fontSize = (20 + Math.random()*20) + "px";
    note.style.animationDuration = (3 + Math.random()*2) + "s";
    notes.appendChild(note);

    setTimeout(() => {
        note.remove();
    },5000);
}