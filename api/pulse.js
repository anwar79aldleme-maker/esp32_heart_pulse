let lastBuffer = [];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { device_id, signal } = req.body;

  if (!Array.isArray(signal)) {
    return res.status(400).json({ error: "Signal must be array" });
  }

  lastBuffer = signal;
  res.status(200).json({ status: "ok" });
}
