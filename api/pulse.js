import { sql } from "./db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { device_id, bpm, signals } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!device_id || !Array.isArray(signals)) return res.status(400).json({ error: "Invalid data" });

  try {
    for (const s of signals) {
      await sql`INSERT INTO pulse_data (device_id, signal, bpm) VALUES (${device_id}, ${s}, ${bpm})`;
    }
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
