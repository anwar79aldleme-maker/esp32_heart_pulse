import { sql } from "./db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { device_id, bpm, signals } = body;

    if (!device_id || !Array.isArray(signals) || signals.length === 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    console.log("Received data:", { device_id, bpm, signals });

    // Insert each signal individually
    for (let signal of signals) {
      await sql`
        INSERT INTO pulse_data (device_id, signal, bpm)
        VALUES (${device_id}, ${signal}, ${bpm})
      `;
    }

    res.status(200).json({ status: "ok" });

  } catch (err) {
    console.error("Error in /pulse:", err);
    res.status(500).json({ error: err.message });
  }
}
