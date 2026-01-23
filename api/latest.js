import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const device_id = req.query.device_id || "max1";

    const data = await kv.get(`signal:${device_id}`);
    res.status(200).json(data || []);
  } catch (err) {
    console.error("latest error:", err);
    res.status(500).json([]);
  }
}
