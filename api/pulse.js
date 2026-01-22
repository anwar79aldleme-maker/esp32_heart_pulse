import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

global.signalStore = global.signalStore || [];

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { device_id, signal, time } = req.body || {};

      if (!device_id || typeof signal !== "number" || !time) {
        return res.status(400).json({ error: "Invalid payload", received: req.body });
      }

      global.signalStore.push(signal);
      if (global.signalStore.length > 600) global.signalStore.shift();

      await pool.query(
        `INSERT INTO sensor_signal (device_id, signal, time) VALUES ($1,$2,$3)`,
        [device_id, signal, time]
      );

      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      return res.status(200).json({ signal: global.signalStore });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "server error", message: err.message });
  }
}
