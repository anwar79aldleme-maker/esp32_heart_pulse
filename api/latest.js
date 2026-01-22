import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  const result = await pool.query(
    `SELECT signal, created_at
     FROM sensor_data
     ORDER BY created_at DESC
     
  );

  // نعكس الترتيب للرسم الصحيح
  res.status(200).json(result.rows.reverse());
}
