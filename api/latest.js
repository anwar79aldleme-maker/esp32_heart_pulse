import { pool } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  try {
    const device_id = req.query.device_id || "max1";

    const { rows } = await pool.query(
      `
      SELECT device_id, signal, time
      FROM sensor_signal
      WHERE device_id = $1
      ORDER BY time ASC
      `,
      [device_id]
    );

    res.status(200).json({
      device_id,
      count: rows.length,
      signal: rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
