import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {

  // ===== Buffer للرسم =====
  global.signalStore = global.signalStore || [];

  try {

    // ================= POST =================
    if (req.method === "POST") {
      const { device_id, signal, time } = req.body || {};

      if (
        !device_id ||
        typeof signal !== "number" ||
        !time
      ) {
        return res.status(400).json({
          error: "Invalid payload",
          received: req.body
        });
      }

      // buffer
      global.signalStore.push(signal);
      if (global.signalStore.length > 600) {
        global.signalStore.shift();
      }

      // Neon insert
      await pool.query(
        `INSERT INTO sensor_signal (device_id, signal, time)
         VALUES ($1, $2, $3)`,
        [device_id, signal, time]
      );

      return res.status(200).json({ ok: true });
    }

    // ================= GET =================
    if (req.method === "GET") {
      return res.status(200).json({
        signal: global.signalStore
      });
    }

    // ================= OTHER =================
    return res.status(405).json({
      error: "Method not allowed"
    });

  } catch (err) {
    console.error("API ERROR:", err);

    // 🔥 مهم جداً: JSON دائماً
    return res.status(500).json({
      error: "server error",
      message: err.message
    });
  }
}
