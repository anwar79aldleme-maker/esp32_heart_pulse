import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      `SELECT signal, created_at
       FROM sensor_data
       ORDER BY created_at DESC
       
    );

    // عكس الترتيب للرسم
    res.status(200).json(result.rows.reverse());

  } catch (error) {
    console.error("LATEST API ERROR:", error);

    // مهم: نرجع JSON وليس HTML
    res.status(500).json({
      error: "Database error",
      details: error.message
    });
  }
}
