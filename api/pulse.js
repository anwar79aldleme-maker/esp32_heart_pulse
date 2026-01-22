let signalStore = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { signal } = req.body;

    if (!Array.isArray(signal)) {
      return res.status(400).json({ error: "Invalid signal" });
    }

    signalStore.push(...signal);

    // حماية الذاكرة فقط (اختياري)
    if (signalStore.length > 5000) {
      signalStore = signalStore.slice(-5000);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
