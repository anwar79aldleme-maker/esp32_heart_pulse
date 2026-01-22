import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  global.signalStore = global.signalStore || [];

  if (req.method === "POST") {
    const { device_id, signal, time } = req.body;

    if (typeof signal === "number") {
      // Buffer للرسم
      global.signalStore.push(signal);
      if (global.signalStore.length > 600)
        global.signalStore.shift();

      // تخزين دائم
      await pool.query(
        "INSERT INTO sensor_signal (device_id, signal, time) VALUES ($1,$2,$3)",
        [device_id, signal, time]
      );
    }

    return res.json({ ok: true });
  }

  if (req.method === "GET") {
    return res.json({
      signal: global.signalStore,
    });
  }

  res.status(405).end();
}
