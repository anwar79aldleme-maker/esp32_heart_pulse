// api/pulse.js
export default async function handler(req, res) {

  // مهم جداً
  global.signalStore = global.signalStore || [];

  if (req.method === "POST") {
    const { signal } = req.body;

    if (typeof signal === "number") {
      global.signalStore.push(signal);

      // حد أقصى للرسم (مثلاً 500 نقطة)
      if (global.signalStore.length > 500) {
        global.signalStore.shift();
      }
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      signal: global.signalStore
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
