import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { device_id, signal } = req.body;
    if (!device_id || signal === undefined)
      return res.status(400).json({ error: "Missing data" });

    await pool.query(
      `INSERT INTO sensor_data (device_id, signal) VALUES ($1, $2)`,
      [device_id, signal]
    );

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
