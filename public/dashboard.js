const DEVICE_ID = "esp32_1";
const MAX_POINTS = 300;
const API_URL = "/api/getData";

const ctx = document.getElementById("pulseChart").getContext("2d");
const bpmDisplay = document.getElementById("bpm");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array(MAX_POINTS).fill(""),
    datasets: [{ data: Array(MAX_POINTS).fill(0), borderColor: "lime", borderWidth: 2, tension: 0.4, pointRadius: 0, fill: false }]
  },
  options: { animation: false, responsive: true, maintainAspectRatio: false,
    scales: { y: { min: 300, max: 700 }, x: { display: false } }, plugins: { legend: { display: false } }
  }
});

async function streamData() {
  try {
    const res = await fetch(`${API_URL}?device_id=${DEVICE_ID}`);
    const data = await res.json();
    const signals = data.slice(-10).map(p => p.signal);
    signals.forEach(s => { chart.data.datasets[0].data.shift(); chart.data.datasets[0].data.push(s); });
    chart.update("none");
    bpmDisplay.innerText = data[data.length - 1].bpm;
  } catch (err) { console.error(err); }
}

setInterval(streamData, 80);
