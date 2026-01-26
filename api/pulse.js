import { sql } from './db';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { device_id, bpm, signals } = body;

    if (!device_id || !Array.isArray(signals)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    for (const s of signals) {
      await sql`
        INSERT INTO pulse_data (device_id, signal, bpm)
        VALUES (${device_id}, ${s}, ${bpm})
      `;
    }

    return res.status(200).json({ status: "ok", received: signals.length });
  } catch (error) {
    console.error("API Error:", error.message);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
