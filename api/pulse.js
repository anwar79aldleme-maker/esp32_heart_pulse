// api/pulse.js

export default function handler(req, res) {

  // تخزين مؤقت للرسم الحي
  global.signalStore = global.signalStore || [];
  global.lastTime = global.lastTime || null;
  global.deviceId = global.deviceId || null;

  if (req.method === "POST") {
    const { device_id, signal, time } = req.body;

    if (typeof signal === "number") {
      global.signalStore.push(signal);

      // حد أقصى للنقاط
      if (global.signalStore.length > 500) {
        global.signalStore.shift();
      }

      global.lastTime = time;
      global.deviceId = device_id;
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      device_id: global.deviceId,
      time: global.lastTime,
      signal: global.signalStore
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
