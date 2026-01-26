
import { sql } from './db';

export default async function handler(req, res) {
  const { device_id } = req.query;
  try {
    const data = await sql`
      SELECT signal, bpm FROM pulse_data
      WHERE device_id = ${device_id}
      ORDER BY id DESC
      LIMIT 300
    `;
    res.status(200).json(data.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
