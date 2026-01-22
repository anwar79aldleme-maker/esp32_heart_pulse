import { pool } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { device_id, signal, time } = req.body;

    if (!device_id || signal === undefined || !time) {
      return res.status(400).json({
        error: "Missing device_id or signal or time"
      });
    }

    await pool.query(
      `
      INSERT INTO sensor_signal (device_id, signal, time)
      VALUES ($1, $2, $3)
      `,
      [device_id, signal, time]
    );

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("DB ERROR:", err);

    // 🔥 مهم جداً
    res.status(500).json({
      error: "server error",
      details: err.message
    });
  }
}
