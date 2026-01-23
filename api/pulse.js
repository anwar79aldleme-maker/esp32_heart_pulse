import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { device_id, signal } = req.body;

  if (!device_id || !Array.isArray(signal)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  await kv.set(`signal:${device_id}`, signal);
  res.status(200).json({ status: "ok" });
}
