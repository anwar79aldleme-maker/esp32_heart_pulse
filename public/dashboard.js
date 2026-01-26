// CONFIGURATION
const DEVICE_ID = "esp32_1"; // غيره إذا كان لديك أكثر من جهاز
const MAX_POINTS = 300;      // عدد نقاط الرسم على المخطط
const API_URL = "/api/getData"; // رابط API الخاص بـ Vercel

// GET ELEMENTS
const ctx = document.getElementById("pulseChart").getContext("2d");
const bpmDisplay = document.getElementById("bpm");

// INITIALIZE CHART
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array(MAX_POINTS).fill(""),
    datasets: [{
      data: Array(MAX_POINTS).fill(0),
      borderColor: "lime",
      borderWidth: 2,
      tension: 0.4,   // لتنعيم الخطوص
      pointRadius: 0, // بدون نقاط
      fill: false
    }]
  },
  options: {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 300,
        max: 700,
        title: { display: true, text: "Pulse Value" }
      },
      x: {
        display: false
      }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

// STREAM FUNCTION
async function streamData() {
  try {
    const res = await fetch(`${API_URL}?device_id=${DEVICE_ID}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    // خذ آخر 10 قيم لتحديث المخطط
    const signals = data.slice(-10).map(p => p.signal);
    signals.forEach(s => {
      chart.data.datasets[0].data.shift();
      chart.data.datasets[0].data.push(s);
    });

    chart.update("none");

    // تحديث BPM
    bpmDisplay.innerText = data[data.length - 1].bpm;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// UPDATE INTERVAL
setInterval(streamData, 80);
