const canvas = document.getElementById("oscilloscope");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const bufferLength = width;
let dataBuffer = new Array(bufferLength).fill(height / 2);
let currentBPM = 0;

const source = new EventSource("/api/sse"); // لاحقًا سننشئ SSE endpoint

source.addEventListener("message", function(event) {
  try {
    const data = JSON.parse(event.data);
    const signal = parseInt(data.signal);
    currentBPM = parseInt(data.bpm);

    dataBuffer.push(signal);
    dataBuffer.shift();

    draw();
  } catch (err) {
    console.error("JSON parse error:", err);
  }
});

function draw() {
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.moveTo(0, mapSignal(dataBuffer[0]));

  for (let i = 1; i < dataBuffer.length; i++) {
    ctx.lineTo(i, mapSignal(dataBuffer[i]));
  }

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "16px monospace";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`BPM: ${currentBPM}`, 10, 20);
}

function mapSignal(signal) {
  const minSignal = 300;
  const maxSignal = 850;
  signal = Math.max(minSignal, Math.min(maxSignal, signal));
  return height - ((signal - minSignal) / (maxSignal - minSignal)) * height;
}
