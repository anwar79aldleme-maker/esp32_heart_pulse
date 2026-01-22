import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {

  global.signalStore = global.signalStore || [];

  if (req.method === "POST") {
    const { device_id, signal } = req.body;

    if (typeof signal === "number") {

      // 1️⃣ تخزين للرسم
      global.signalStore.push(signal);
      if (global.signalStore.length > 500) {
        global.signalStore.shift();
      }

      // 2️⃣ تخزين دائم في Neon
      await pool.query(
        "INSERT INTO sensor_signal (device_id, signal) VALUES ($1, $2)",
        [device_id, signal]
      );
    }

    return res.json({ ok: true });
  }

  if (req.method === "GET") {
    return res.json({ signal: global.signalStore });
  }

  res.status(405).end();
}
