// ===== Global Buffer =====
global.signalStore = global.signalStore || [];

export default function handler(req, res) {

  // استقبال من ESP32
  if (req.method === "POST") {
    const { signal } = req.body;

    if (signal === undefined) {
      return res.status(400).json({ error: "signal missing" });
    }

    global.signalStore.push({
      signal: Number(signal),
      time: Date.now()
    });

    // حماية بسيطة من استهلاك الذاكرة (اختياري)
    if (global.signalStore.length > 3000) {
      global.signalStore.shift();
    }

    return res.status(200).json({ ok: true });
  }

  // إرسال للداشبورد
  if (req.method === "GET") {
    return res.status(200).json(global.signalStore);
  }

  return res.status(405).json({ error: "POST & GET only" });
}
