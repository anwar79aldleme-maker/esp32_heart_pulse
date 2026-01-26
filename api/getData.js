import { sql } from "./db";

export default async function handler(req, res) {
  const { device_id } = req.query;
  if (!device_id) return res.status(400).json({ error: "device_id required" });

  try {
    const data = await sql`SELECT signal, bpm FROM pulse_data WHERE device_id = ${device_id} ORDER BY id DESC LIMIT 300`;
    res.status(200).json(data.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
