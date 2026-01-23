import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      `SELECT signal, created_at
       FROM sensor_data
       WHERE device_id = $1
       ORDER BY created_at ASC
       LIMIT 200`,
      [req.query.device_id || "max1"]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("latest error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
}
