import { sql } from "./db";

export default async function handler(req, res) {
  try {
    const { device_id } = req.query;
    if (!device_id) return res.status(400).json({ error: "device_id required" });

    const rows = await sql`
      SELECT signal, bpm, created_at
      FROM pulse_data
      WHERE device_id = ${device_id}
      ORDER BY id DESC
      LIMIT 300
    `;

    res.status(200).json(rows.reverse()); // عرض الأقدم أولاً
  } catch (err) {
    console.error("Error in /getData:", err);
    res.status(500).json({ error: err.message });
  }
}
