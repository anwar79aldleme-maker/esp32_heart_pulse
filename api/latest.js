import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const { device_id = "max1" } = req.query;

    const result = await pool.query(
      `
      SELECT signal
      FROM sensor_data
      WHERE device_id = $1
      ORDER BY created_at DESC
      LIMIT 200
      `,
      [device_id]
    );

    // نعكس الترتيب ليكون قديم → جديد (للرسم)
    const data = result.rows.reverse();

    res.status(200).json(data);

  } catch (err) {
    console.error("API /latest error:", err);
    res.status(500).json({ error: "Database error" });
  }
}
