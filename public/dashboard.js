const canvas = document.getElementById("oscilloscope");
const ctx = canvas.getContext("2d");

let deviceId = document.getElementById("deviceId").value;
let bpmEl = document.getElementById("bpmVal");
let buffer = [];

function start() {
  deviceId = document.getElementById("deviceId").value;
  fetchData();
  setInterval(fetchData, 1000); // كل ثانية
}

async function fetchData() {
  try {
    const res = await fetch(`/api/getData?device_id=${deviceId}`);
    const data = await res.json();

    buffer = data.map(d => d.signal);
    const bpm = data.length ? data[data.length - 1].bpm : 0;
    bpmEl.textContent = bpm;

    drawOscilloscope();
  } catch (err) {
    console.error(err);
  }
}

function drawOscilloscope() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const len = buffer.length;
  const step = canvas.width / len;

  for (let i = 0; i < len; i++) {
    const x = i * step;
    const y = canvas.height - ((buffer[i] - 350) / 500) * canvas.height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}
